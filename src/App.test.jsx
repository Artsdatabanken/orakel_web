import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the start prompt", () => {
  render(<App />);
  expect(
    screen.getByText(/Ta eller velg et bilde for å starte/i)
  ).toBeInTheDocument();
});
