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
  expect(screen.getByRole("contentinfo")).toBeInTheDocument(); // <footer>
});
