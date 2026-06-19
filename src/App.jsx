import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";
import { aiApiUrl } from "./config";
import { getExif, gpsFromExif } from "./utils/utils";
import SiteHeader from "./components/SiteHeader";
import StartPage from "./components/StartPage";
import ResultListPage from "./components/ResultListPage";
import ImageCropper from "./components/ImageCropper";
import About from "./components/About";
import ExtendedManual from "./components/ExtendedManual";

function App() {
  const [view, setView] = useState("start");
  const [croppedImages, setCroppedImages] = useState([]);
  const [uncroppedImages, setUncroppedImages] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  // null when the cropper is processing a brand-new upload, or an
  // index into croppedImages when the user is re-cropping an
  // existing thumbnail. The pending uncropped file is the same either
  // way — uncroppedImages[0] — but the disposition of the result
  // (append vs replace, or remove if the user trashes it) differs.
  const [editIndex, setEditIndex] = useState(null);
  const abortRef = useRef(null);

  // Revoke object URLs only when the app actually tears down — NOT on every
  // change to croppedImages. The previous [croppedImages] dependency revoked
  // *all* current URLs whenever the array changed, so adding a second image
  // killed the first image's still-displayed blob URL (it survived in the
  // start-page thumbnail only because that <img> had already decoded, but a
  // freshly-rendered <img> on the results page loaded the dead URL and broke).
  // Individual URLs are revoked where images actually leave the set: the
  // edit/trash branches of onImageCropped and reset().
  const croppedImagesRef = useRef(croppedImages);
  croppedImagesRef.current = croppedImages;
  useEffect(() => {
    return () => {
      croppedImagesRef.current.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, []);

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
      // Adding an image invalidates any existing result. Return to the
      // input view so the new image is actually visible (the results
      // gallery only shows the first image) and the full set can be
      // re-identified — otherwise adding from the results page silently
      // appends an unseen image and runs no new calculation.
      setPredictions([]);
      setError(null);
      setView("start");
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

    // Mirror the native apps: latitude/longitude as separate fields,
    // rounded to 1 decimal (~11 km). Source the GPS from the first
    // image's untouched original — the cropped blob has had its GPS
    // IFD stripped.
    const firstOriginal = croppedImages[0]?.original;
    if (firstOriginal) {
      try {
        const exif = await getExif(firstOriginal);
        const gps = gpsFromExif(exif);
        if (gps) {
          formdata.append("latitude", gps.lat.toFixed(1));
          formdata.append("longitude", gps.lon.toFixed(1));
        }
      } catch {
        // No GPS / unreadable EXIF — fall through without location.
      }
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
    croppedImages.forEach((p) => URL.revokeObjectURL(p.url));
    setCroppedImages([]);
    setPredictions([]);
    setError(null);
    setView("start");
  };

  const BREADCRUMB_KEYS = {
    results: "web_breadcrumb_results",
    about: "about",
    faq: "faq",
  };

  return (
    <div className="App" id="main-content">
      <SiteHeader
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((d) => !d)}
        onOpenAbout={() => setView("about")}
        onOpenManual={() => setView("faq")}
        breadcrumbCurrentKey={BREADCRUMB_KEYS[view] ?? null}
        onGoHome={reset}
      />

      {uncroppedImages.length > 0 && (
        <ImageCropper
          imgFile={uncroppedImages[0]}
          imageCropped={onImageCropped}
          imgSize={500}
          darkMode={darkMode}
        />
      )}

      <main className="App__main">
        {view === "start" && (
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
        )}
        {view === "results" && (
          <ResultListPage
            previews={croppedImages}
            predictions={predictions}
            onAddFiles={addFiles}
            onEditPreview={editPreview}
            onBack={reset}
          />
        )}
        {view === "about" && (
          <div className="infoPage startPage__inner">
            <About />
          </div>
        )}
        {view === "faq" && (
          <div className="infoPage startPage__inner">
            <ExtendedManual />
          </div>
        )}
      </main>
      <adb-site-footer />
    </div>
  );
}

export default App;
