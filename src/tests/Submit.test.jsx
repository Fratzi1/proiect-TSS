import Submit from "../components/Submit";
import { describe } from "vitest";
import { render, screen } from "@testing-library/react";

describe("test Submit component", () => {
  test("test button to be enabled", () => {
    render(<Submit />);
    const button = screen.getByRole("button");
    expect(button).toBeEnabled();
  });

  test("test button to be Order", () => {
    render(<Submit />);
    expect(screen.queryByText(/Order/)).toBeInTheDocument();
  });
});
