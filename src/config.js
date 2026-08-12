// Host-based switch between prod and test AI endpoints:
//  - orakel.artsdatabanken.no → https://ai.artsdatabanken.no
//  - everything else (dev, orakel.test.artsdatabanken.no) → https://ai.test.artsdatabanken.no
const isProdHost =
  typeof window !== "undefined" &&
  window.location.hostname === "orakel.artsdatabanken.no";

// Bare host — callers append their path (/identify, /save).
export const aiApiUrl = isProdHost
  ? "https://ai.artsdatabanken.no"
  : "https://ai.test.artsdatabanken.no";

// Token sources, in order:
//  - window.ENV.AI_TOKEN — written by the Docker entrypoint at container
//    startup from the AI_TOKEN env var (App Service ← Key Vault reference)
//  - VITE_AI_TOKEN — build-time fallback for local dev (.env.local)
export const aiApiToken =
  (typeof window !== "undefined" && window.ENV?.AI_TOKEN) ||
  import.meta.env.VITE_AI_TOKEN ||
  "";
