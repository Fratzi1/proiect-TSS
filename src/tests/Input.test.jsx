import Input from "../components/Input";
import { render, screen } from "@testing-library/react";

describe("test Input", () => {
  test("renders input with label and default value", () => {
    render(
      <Input name="name" type="text" label="Full name" defaultValue="Vlad" />,
    );

    const input = screen.getByLabelText(/full name/i);

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("name", "name");
    expect(input).toHaveAttribute("id", "name");
    expect(input).toHaveValue("Vlad");
  });
});
