// <adb-site-footer> — embeddable web component that renders the live
// artsdatabanken.no footer. Reads a pre-snapshotted JSON (refreshed at
// build time by scripts/snapshot-adb-footer.mjs) so we don't depend on
// runtime CORS, and caches the payload in localStorage for the TTL
// below so repeat page loads skip the round-trip entirely.
//
// Embed from any page with:
//   <script type="module" src="https://orakel.artsdatabanken.no/components/adb-site-footer.js"></script>
//   <adb-site-footer></adb-site-footer>
// Override the snapshot URL with the `src` attribute.

// Bumped to v2 when the snapshot schema changed from {stylesheets: []}
// (cross-origin <link> URLs) to {styles: []} (inlined CSS with :root →
// :host rewrites). Old cache entries without `styles` rendered the
// footer markup with no styling at all.
const CACHE_KEY = "adb-site-footer:snapshot:v2";
const CACHE_TTL_MS = 48 * 60 * 60 * 1000; // refresh roughly every other day

const SCRIPT_ORIGIN = new URL(".", import.meta.url);
const DEFAULT_SRC = new URL("adb-footer-snapshot.json", SCRIPT_ORIGIN).toString();

const inflight = new Map();

async function loadSnapshot(url) {
  if (inflight.has(url)) return inflight.get(url);

  const promise = (async () => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw);
        if (
          cached.url === url &&
          typeof cached.cachedAt === "number" &&
          Date.now() - cached.cachedAt < CACHE_TTL_MS
        ) {
          return cached.data;
        }
      }
    } catch {
      // ignore corrupted cache
    }

    const res = await fetch(url, { credentials: "omit" });
    if (!res.ok) {
      throw new Error(`adb-site-footer: ${url} returned ${res.status}`);
    }
    const data = await res.json();

    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ url, cachedAt: Date.now(), data })
      );
    } catch {
      // private mode / quota — non-fatal, just no persistent cache
    }

    return data;
  })();

  inflight.set(url, promise);
  promise.finally(() => inflight.delete(url));
  return promise;
}

class AdbSiteFooter extends HTMLElement {
  static get observedAttributes() {
    return ["src"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  async render() {
    const url = this.getAttribute("src") || DEFAULT_SRC;
    try {
      const { html, styles } = await loadSnapshot(url);
      // Inline styles in the shadow root so :root → :host rewrites
      // from snapshot-adb-footer.mjs let design tokens cascade down.
      const styleTags = (styles || [])
        .map((css) => {
          const tag = document.createElement("style");
          tag.textContent = css;
          return tag.outerHTML;
        })
        .join("");
      this.shadowRoot.innerHTML = `${styleTags}${html || ""}`;
    } catch (err) {
      console.error("[adb-site-footer]", err);
      this.shadowRoot.innerHTML = "";
    }
  }
}

if (!customElements.get("adb-site-footer")) {
  customElements.define("adb-site-footer", AdbSiteFooter);
}

export { AdbSiteFooter };
