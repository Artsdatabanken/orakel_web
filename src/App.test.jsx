import { render, screen } from "@testing-library/react";
import App from "./App";
import { LanguageProvider } from "./i18n";

test("renders the main page chrome", () => {
  render(
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
  expect(screen.getByRole("banner")).toBeInTheDocument(); // <header>
  expect(screen.getByRole("main")).toBeInTheDocument();
  // <adb-site-footer> is a Lit web component; jsdom doesn't register it,
  // so it has no implicit ARIA role — check the tag directly instead.
  expect(document.querySelector("adb-site-footer")).toBeInTheDocument();
});
