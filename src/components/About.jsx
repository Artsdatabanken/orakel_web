import React, { useMemo } from "react";
import { useTranslation } from "../i18n";
import logoArtsdatabankenRaw from "../assets/logo-artsdatabanken-text.svg?raw";
import logoNaturalisRaw from "../assets/logo-naturalis.svg?raw";

// Per-language about copy lives in src/locales/about/about_{lang}.html.
// Vite's glob import pulls them all in at build time.
const ABOUT_HTML = import.meta.glob("../locales/about/about_*.html", {
  query: "?raw",
  import: "default",
  eager: true,
});

function pickLanguage(activeCode) {
  const key = `../locales/about/about_${activeCode}.html`;
  if (ABOUT_HTML[key]) return ABOUT_HTML[key];
  return ABOUT_HTML["../locales/about/about_en.html"];
}

// Replace the native `<img src="file:///android_asset/Logo_*.svg" .../>`
// references with the actual inline SVG markup we shipped in src/assets.
// Inlining means the icons inherit `color`/`fill` from CSS — same
// approach iOS uses to recolor the marks for dark mode.
function inlineSharedLogos(html) {
  return html
    .replace(
      /<img\s[^>]*Logo_artsdatabanken\.svg[^>]*\/?>/gi,
      `<span class="aboutModal__logo aboutModal__logo--adb">${logoArtsdatabankenRaw}</span>`,
    )
    .replace(
      /<img\s[^>]*Logo_naturalis\.svg[^>]*\/?>/gi,
      `<span class="aboutModal__logo aboutModal__logo--naturalis">${logoNaturalisRaw}</span>`,
    );
}

function About() {
  const { activeCode } = useTranslation();
  const html = useMemo(() => {
    const raw = pickLanguage(activeCode);
    const version = import.meta.env.ORAKEL_VERSION ?? "dev";
    return inlineSharedLogos(raw).replace(/\[Version number\]/g, version);
  }, [activeCode]);

  return (
    <div
      className="aboutModal"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default About;
