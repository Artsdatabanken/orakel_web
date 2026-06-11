// Build-time configuration. Vite inlines import.meta.env.ORAKEL_* into
// the bundle (see envPrefix in vite.config.js), so these are NOT runtime
// secrets — anyone loading the site can read them. Suitable for light
// gatekeeping / per-app quota, not for high-trust auth.
//
// Locally:  set in .env.local (gitignored).
// Azure:    set as pipeline variables on each azure-pipelines*.yml
//           pipeline, mapped into the build step's env. Each pipeline
//           targets a single branch (main → prod, dev → test) so the
//           values diverge per environment.

const fallbackBase =
  typeof window !== "undefined" &&
  window.location.hostname === "orakel.artsdatabanken.no"
    ? "https://ai.artsdatabanken.no"
    : "https://ai.test.artsdatabanken.no";

export const aiApiUrl = import.meta.env.ORAKEL_API_BASE ?? fallbackBase;
export const aiIdentifyUrl = `${aiApiUrl}/identify`;
export const aiApiToken = import.meta.env.ORAKEL_API_TOKEN ?? "";
