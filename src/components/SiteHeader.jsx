import React, { useState, useRef, useEffect } from "react";
import { useTranslation, SUPPORTED_LANGUAGES } from "../i18n";
import adbLogoLight from "../assets/adb-logo-light.svg";
import adbLogoDark from "../assets/adb-logo-dark.svg";
import chevronSeparatorRaw from "../assets/chevron-separator.svg?raw";
import icLanguageRaw from "../assets/ic-language.svg?raw";
import icThemeMoonRaw from "../assets/ic-theme-moon.svg?raw";
import icThemeSunRaw from "../assets/ic-theme-sun.svg?raw";
import icArrowDropDownRaw from "../assets/ic-arrow-drop-down.svg?raw";
import breadcrumbBeakRaw from "../assets/breadcrumb-beak.svg?raw";

function SiteHeader({
  darkMode,
  onToggleTheme,
  onOpenAbout,
  onOpenManual,
  breadcrumbCurrentKey,
  onGoHome,
}) {
  const { t, selection, setLanguage } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  const logoSrc = darkMode ? adbLogoDark : adbLogoLight;

  useEffect(() => {
    if (!langOpen) return undefined;
    const onDocClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [langOpen]);

  return (
    <header className="siteHeader">
      <div className="siteHeader__bar">
        <div className="siteHeader__brand">
          <a href="#" className="siteHeader__logoLink" aria-label={t("web_til_forsiden_aria")}>
            <img src={logoSrc} alt="Artsdatabanken" className="siteHeader__logoImg" />
          </a>
          <span
            className="siteHeader__divider"
            aria-hidden
            dangerouslySetInnerHTML={{ __html: chevronSeparatorRaw }}
          />
          <a href="#" className="siteHeader__serviceName">Artsorakel</a>
        </div>

        <nav className="siteHeader__nav" aria-label={t("menu")}>
          <button
            type="button"
            className="siteHeader__navLink siteHeader__navBtn"
            onClick={(e) => {
              e.preventDefault();
              onOpenAbout?.();
            }}
          >
            {`${t("about")} Artsorakel`}
          </button>
          <button
            type="button"
            className="siteHeader__navLink siteHeader__navBtn"
            onClick={(e) => {
              e.preventDefault();
              onOpenManual?.();
            }}
          >
            {t("faq")}
          </button>
        </nav>

        <div className="siteHeader__controls">
          <div className="siteHeader__langWrap" ref={langRef}>
            <button
              type="button"
              className="siteHeader__langBtn"
              onClick={() => setLangOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
            >
              <span
                className="siteHeader__icon"
                aria-hidden
                dangerouslySetInnerHTML={{ __html: icLanguageRaw }}
              />
              <span>{t("language_language")}/language</span>
              <span
                className="siteHeader__icon siteHeader__icon--caret"
                aria-hidden
                dangerouslySetInnerHTML={{ __html: icArrowDropDownRaw }}
              />
            </button>
            {langOpen && (
              <ul
                className="siteHeader__langMenu"
                role="listbox"
                aria-label={t("web_lang_dropdown_label")}
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <li key={lang.code}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selection === lang.code}
                      className={`siteHeader__langOption${
                        selection === lang.code ? " siteHeader__langOption--selected" : ""
                      }`}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangOpen(false);
                      }}
                    >
                      {t(lang.labelKey)}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            className="siteHeader__themeBtn"
            onClick={onToggleTheme}
            aria-label={darkMode ? t("web_change_theme_to_light") : t("web_change_theme_to_dark")}
            aria-pressed={darkMode}
          >
            <span
              className="siteHeader__icon"
              aria-hidden
              dangerouslySetInnerHTML={{
                __html: darkMode ? icThemeSunRaw : icThemeMoonRaw,
              }}
            />
          </button>
        </div>
      </div>

      {breadcrumbCurrentKey && (
        <div className="siteHeader__tertiary">
          <nav className="siteHeader__breadcrumb" aria-label={t("web_breadcrumb_label")}>
            <a
              href="#"
              className="siteHeader__breadcrumbLink"
              onClick={(e) => {
                if (!onGoHome) return;
                e.preventDefault();
                onGoHome();
              }}
            >
              {t("web_breadcrumb_forside")}
            </a>
            <span
              className="siteHeader__breadcrumbSep"
              aria-hidden
              dangerouslySetInnerHTML={{ __html: breadcrumbBeakRaw }}
            />
            <span className="siteHeader__breadcrumbCurrent">
              {t(breadcrumbCurrentKey)}
            </span>
          </nav>
        </div>
      )}
    </header>
  );
}

export default SiteHeader;
