import React from "react";
import ReactDOM from "react-dom/client";
import "@artsdatabanken/tokens";
import "@artsdatabanken/icons/icon";
import "./index.css";
import App from "./App";
import { LanguageProvider } from "./i18n";

const setVh = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

setVh();
window.addEventListener("resize", setVh);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);
