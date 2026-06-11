import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    css: true,
    // MUI 9.1+ Transition.mjs does a directory import of
    // react-transition-group/TransitionGroupContext which Node's strict
    // ESM resolver rejects. Inlining MUI routes the .mjs through Vite's
    // resolver, which handles the legacy shape.
    server: { deps: { inline: ["@mui/material"] } },
  },
});
