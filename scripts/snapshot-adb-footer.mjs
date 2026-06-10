#!/usr/bin/env node
// Pulls the live footer from artsdatabanken.no and writes a snapshot
// JSON that the <adb-site-footer> web component reads at runtime.
// Runs at npm install / build time; the component then caches the JSON
// in localStorage for the configured TTL.

import { writeFile, mkdir, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE = "https://artsdatabanken.no/";
const OUT = resolve(
  fileURLToPath(import.meta.url),
  "../../public/components/adb-footer-snapshot.json"
);

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  let html;
  try {
    const res = await fetch(SOURCE, { redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch (err) {
    if (await fileExists(OUT)) {
      console.warn(
        `[snapshot-adb-footer] fetch failed (${err.message}); keeping existing snapshot.`
      );
      return;
    }
    throw new Error(
      `Could not fetch ${SOURCE} and no prior snapshot exists at ${OUT}: ${err.message}`
    );
  }

  const footerMatch = html.match(/<footer class="body-footer"[\s\S]*?<\/footer>/);
  if (!footerMatch) {
    throw new Error("Could not locate <footer class=\"body-footer\"> in fetched page");
  }
  let footerHtml = footerMatch[0];

  const stylesheetUrls = [
    ...html.matchAll(
      /<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["']([^"']+)["'][^>]*>/gi
    ),
  ]
    .map((m) => m[1].replace(/&amp;/g, "&"))
    .map((href) => new URL(href, SOURCE).toString());

  // Rewrite root-relative URLs inside the footer markup to absolute so
  // the component works when embedded on any origin.
  footerHtml = footerHtml.replace(
    /\b(href|src)=["']\/(?!\/)([^"']*)["']/g,
    (_, attr, path) => `${attr}="${new URL(path, SOURCE).toString()}"`
  );

  // Fetch and inline each stylesheet, rewriting :root → :host so the
  // design tokens land on the custom-element host (and therefore
  // cascade into the shadow root). Without this, every var(--…) inside
  // the shadow resolves to empty and the footer renders unstyled.
  // url(...) references are made absolute so fonts/images still load.
  const styles = [];
  for (const url of stylesheetUrls) {
    try {
      const cssRes = await fetch(url);
      if (!cssRes.ok) {
        console.warn(`[snapshot-adb-footer] skip ${url} (HTTP ${cssRes.status})`);
        continue;
      }
      let css = await cssRes.text();
      css = css.replace(/:root\b/g, ":host");
      css = css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (match, quote, path) => {
        if (/^(?:https?:|data:|blob:|#)/i.test(path)) return match;
        return `url(${quote}${new URL(path, url).toString()}${quote})`;
      });
      styles.push(css);
    } catch (err) {
      console.warn(`[snapshot-adb-footer] skip ${url} (${err.message})`);
    }
  }

  const payload = {
    source: SOURCE,
    fetchedAt: new Date().toISOString(),
    html: footerHtml,
    styles,
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(payload, null, 2) + "\n");

  const totalCss = styles.reduce((n, s) => n + s.length, 0);
  console.log(
    `[snapshot-adb-footer] wrote ${footerHtml.length} bytes of footer + ${styles.length} inlined stylesheets (${totalCss} bytes) → ${OUT}`
  );
}

main().catch((err) => {
  console.error("[snapshot-adb-footer]", err.message);
  process.exit(1);
});
