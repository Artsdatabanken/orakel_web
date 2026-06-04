import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";
import { aiApiUrl } from "./config";
import { useTranslation } from "./i18n";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import StartPage from "./components/StartPage";
import ResultListPage from "./components/ResultListPage";
import ImageCropper from "./components/ImageCropper";
import About from "./components/About";
import ExtendedManual from "./components/ExtendedManual";

function App() {
  const { t } = useTranslation();
  const [view, setView] = useState("start");
  const [croppedImages, setCroppedImages] = useState([]);
  const [uncroppedImages, setUncroppedImages] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [modal, setModal] = useState(null);
  // null when the cropper is processing a brand-new upload, or an
  // index into croppedImages when the user is re-cropping an
  // existing thumbnail. The pending uncropped file is the same either
  // way — uncroppedImages[0] — but the disposition of the result
  // (append vs replace, or remove if the user trashes it) differs.
  const [editIndex, setEditIndex] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    return () => {
      croppedImages.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [croppedImages]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const addFiles = (files) => {
    if (!files || files.length === 0) return;
    setUncroppedImages((prev) => [...prev, ...files]);
  };

  const onImageCropped = (blob) => {
    const original = uncroppedImages[0];
    if (editIndex !== null) {
      setCroppedImages((prev) => {
        if (!blob) {
          // Trash button while editing → remove the entry entirely.
          const removed = prev[editIndex];
          if (removed) URL.revokeObjectURL(removed.url);
          return prev.filter((_, i) => i !== editIndex);
        }
        // Confirm → replace at the same index, carry forward the
        // original file so the user can re-crop again later.
        const url = URL.createObjectURL(blob);
        blob.lastModifiedDate = new Date();
        blob.name = new Date().toISOString() + ".jpg";
        return prev.map((p, i) => {
          if (i !== editIndex) return p;
          URL.revokeObjectURL(p.url);
          return { blob, url, name: blob.name, original: p.original ?? original };
        });
      });
      // Re-cropping invalidates any predictions that referred to the
      // previous crop; force the user to re-identify.
      setPredictions([]);
      setError(null);
      setView("start");
      setEditIndex(null);
    } else if (blob) {
      const url = URL.createObjectURL(blob);
      blob.lastModifiedDate = new Date();
      blob.name = new Date().toISOString() + ".jpg";
      setCroppedImages((prev) => [
        ...prev,
        { blob, url, name: blob.name, original },
      ]);
    }
    setUncroppedImages((prev) => prev.slice(1));
  };

  const editPreview = (index) => {
    const item = croppedImages[index];
    if (!item?.original) return;
    setEditIndex(index);
    setUncroppedImages((prev) => [item.original, ...prev]);
  };

  const identify = async () => {
    if (croppedImages.length === 0) return;
    setError(null);
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const formdata = new FormData();
    formdata.append("application", "Artsorakel Web");
    for (const img of croppedImages) {
      formdata.append("image", img.blob);
    }

    try {
      const res = await axios.post(aiApiUrl, formdata, {
        signal: controller.signal,
      });
      let preds = res.data.predictions[0].taxa.items.filter(
        (p) => p.probability > 0.02
      );
      if (preds.length === 0) preds = res.data.predictions[0].taxa.items;
      if (preds.length > 5) preds = preds.slice(0, 5);
      preds = preds.map((p) => {
        const fullId = p.scientific_name_id || p.scientificNameID || "";
        const extracted = fullId.includes(":") ? fullId.split(":").pop() : fullId;
        return { ...p, scientificNameID: extracted || null };
      });
      setPredictions(preds);
      setView("results");
    } catch (err) {
      if (axios.isCancel(err) || err.name === "CanceledError") return;
      setError(err?.response?.status ?? "?");
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const abortIdentify = () => {
    abortRef.current?.abort();
  };

  const reset = () => {
    setCroppedImages([]);
    setPredictions([]);
    setError(null);
    setView("start");
  };

  const closeModal = () => setModal(null);

  return (
    <div className="App">
      <SiteHeader
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((d) => !d)}
        onOpenAbout={() => setModal("about")}
        onOpenManual={() => setModal("manual")}
      />

      {uncroppedImages.length > 0 && (
        <ImageCropper
          imgFile={uncroppedImages[0]}
          imageCropped={onImageCropped}
          imgSize={500}
          darkMode={darkMode}
        />
      )}

      {modal && (
        <div
          className="overlay"
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <div
            className="overlay__content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="overlay__close"
              onClick={closeModal}
              aria-label={t("close")}
            >
              ×
            </button>
            {modal === "about" && <About />}
            {modal === "manual" && <ExtendedManual />}
          </div>
        </div>
      )}

      <main className="App__main" id="top">
        {view === "start" ? (
          <StartPage
            previews={croppedImages}
            onAddFiles={addFiles}
            onEditPreview={editPreview}
            onIdentify={identify}
            onAbort={abortIdentify}
            loading={loading}
            error={error}
            darkMode={darkMode}
          />
        ) : (
          <ResultListPage
            previews={croppedImages}
            predictions={predictions}
            onAddFiles={addFiles}
            onBack={reset}
          />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
