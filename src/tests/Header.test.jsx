import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import Header from "../components/Header";

describe("test Header", () => {
  test("modal opens on click", async () => {
    render(<Header />);

    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).not.toHaveAttribute("open");

    await userEvent.click(screen.getByRole("button", { name: /cart/i }));

    expect(dialog).toHaveAttribute("open");
    expect(screen.getByText(/No items in the cart!/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /checkout/i })).toBeNull();
  });
});
