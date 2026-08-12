// Host-based switch between prod and test AI endpoints:
//  - orakel.artsdatabanken.no → https://ai.artsdatabanken.no
//  - everything else (dev, orakel.test.artsdatabanken.no) → https://ai.test.artsdatabanken.no
const isProdHost =
  typeof window !== "undefined" &&
  window.location.hostname === "orakel.artsdatabanken.no";

export const aiApiUrl = isProdHost
  ? "https://ai.artsdatabanken.no/identify"
  : "https://ai.test.artsdatabanken.no/identify";

export const aiApiToken = import.meta.env.VITE_AI_TOKEN ?? "";
