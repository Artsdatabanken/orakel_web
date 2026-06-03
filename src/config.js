// Host-based fallback so that builds without an explicit ORAKEL_API_URL
// still hit the right environment:
//  - orakel.artsdatabanken.no → production AI
//  - everything else (dev, orakel.test.artsdatabanken.no) → test AI
// Builds that set ORAKEL_API_URL explicitly (Azure Pipelines, .env.local)
// override the fallback.
const isProdHost =
  typeof window !== "undefined" &&
  window.location.hostname === "orakel.artsdatabanken.no";

const fallbackApiUrl = isProdHost
  ? "https://ai.artsdatabanken.no/identify"
  : "https://ai.test.artsdatabanken.no/identify";

export const aiApiUrl = import.meta.env.ORAKEL_API_URL || fallbackApiUrl;
export const aiApiToken = import.meta.env.ORAKEL_API_TOKEN;

export const aiAuthHeaders = aiApiToken
  ? { Authorization: `Bearer ${aiApiToken}` }
  : {};
