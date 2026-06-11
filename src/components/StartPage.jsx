import React from "react";
import { useTranslation } from "../i18n";
import heroAvatarLight from "../assets/hero-avatar.svg";
import heroAvatarDark from "../assets/hero-avatar-dark.svg";
import disclaimerIconsRaw from "../assets/disclaimer-icons.svg?raw";
import googlePlayBadge from "../assets/google-play-badge.png";
import appStoreBadge from "../assets/app-store-badge.svg";
import LoadingPanel from "./LoadingPanel";

function StartPage({ previews, onAddFiles, onEditPreview, onIdentify, onAbort, loading, error, darkMode }) {
  const { t } = useTranslation();

  const handleFiles = (event) => {
    const files = Array.from(event.target.files || []);
    onAddFiles(files);
    event.target.value = "";
  };

  // The drop target stays visually identical to Figma — no
  // dragover highlight — so preventDefault is the only thing we
  // need here to make the browser actually accept the drop.
  const handleDragOver = (e) => {
    if (loading) return;
    if (!Array.from(e.dataTransfer?.types || []).includes("Files")) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e) => {
    if (loading) return;
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length) onAddFiles(files);
  };

  const hasImages = previews.length > 0;

  return (
    <div className="startPage">
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero__inner">
          <div className="hero__text">
            <h1 className="hero__heading" id="hero-heading">
              {t("main_title")}
            </h1>
            <p className="hero__paragraph">{t("web_hero_subtitle")}</p>
          </div>
          <img
            className="hero__avatar"
            src={darkMode ? heroAvatarDark : heroAvatarLight}
            alt={t("avatar_description")}
            width="248"
            height="279"
          />
        </div>
      </section>

      <section className="startPage__inner">
        <div
          className="dropzone"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {loading ? (
            <LoadingPanel onAbort={onAbort} />
          ) : (
            <div className="dropzone__content">
              <div className="dropzone__choose">
                <p className="dropzone__hint">{t("web_dropzone_hint")}</p>
                <label className="dropzone__button">
                  {t("web_choose_images")}
                  <input
                    type="file"
                    id="uploaderImages"
                    accept="image/*"
                    multiple
                    className="dropzone__input"
                    onChange={handleFiles}
                  />
                </label>
              </div>

              {hasImages && (
                <>
                  <ul className="dropzone__thumbs" aria-label={t("web_selected_images_label")}>
                    {previews.map((p, i) => (
                      <li key={i} className="dropzone__thumb">
                        <button
                          type="button"
                          className="dropzone__thumbBtn"
                          onClick={() => onEditPreview?.(i)}
                          title={t("crop_hint")}
                        >
                          <img src={p.url} alt={p.name} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="dropzone__identifyBtn"
                    onClick={onIdentify}
                  >
                    {t("identify")}
                  </button>
                </>
              )}

              {error && (
                <p className="dropzone__error" role="alert">
                  {t("identification_error")} {error !== "?" && `(${error})`}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="disclaimer">
          <p>{t("web_disclaimer_1")}</p>
          <p>{t("web_disclaimer_2")}</p>
          <div
            className="disclaimer__icons"
            role="img"
            aria-hidden
            dangerouslySetInnerHTML={{ __html: disclaimerIconsRaw }}
          />
        </div>

        <hr className="rule" aria-hidden />

        <section className="appDownload" aria-labelledby="app-heading">
          <h2 className="appDownload__heading" id="app-heading">
            {t("web_app_download_title")}
          </h2>
          <p className="appDownload__paragraph">
            {t("web_app_download_body_line1")}
            <br />
            {t("web_app_download_body_line2")}
          </p>
          <div className="appDownload__badges" aria-label={t("web_app_download_badges_label")}>
            <a href="#" className="appDownload__badge appDownload__badge--play">
              <img src={googlePlayBadge} alt="Google Play" />
            </a>
            <a href="#" className="appDownload__badge appDownload__badge--ios">
              <img src={appStoreBadge} alt="App Store" />
            </a>
          </div>
        </section>
      </section>
    </div>
  );
}

export default StartPage;
