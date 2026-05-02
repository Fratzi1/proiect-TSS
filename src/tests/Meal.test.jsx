import Meal from "../components/Meal";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MealsContext } from "../components/meals-context";

describe("test Meal component", () => {
  test("Meal renders the content from props", () => {
    render(
      <MealsContext
        value={{
          meals: [],
          items: [],
          addItemToCart: vi.fn(),
          updateItemQuantity: vi.fn(),
          addOrder: vi.fn(),
        }}
      >
        <Meal
          meal={{
            id: "1",
            name: "Fasole batuta",
            price: "20",
            description: "Este o mancare foarte gustoasa.",
            image: "test.jpg",
          }}
        />
      </MealsContext>,
    );

    expect(
      screen.getByRole("heading", { name: /fasole batuta/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("$20.00")).toBeInTheDocument();
    expect(
      screen.getByText(/este o mancare foarte gustoasa\./i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /no image found/i }),
    ).toHaveAttribute("src", "./../../backend/public/test.jpg");
    expect(
      screen.getByRole("button", { name: /add to cart/i }),
    ).toBeInTheDocument();
  });

  test("clicking Add to cart calls addItemToCart with meal id", async () => {
    const addItemToCartMock = vi.fn();

    render(
      <MealsContext
        value={{
          meals: [],
          items: [],
          addItemToCart: addItemToCartMock,
          updateItemQuantity: vi.fn(),
          addOrder: vi.fn(),
        }}
      >
        <Meal
          meal={{
            id: "1",
            name: "Fasole batuta",
            price: "20",
            description: "Este o mancare foarte gustoasa.",
            image: "test.jpg",
          }}
        />
      </MealsContext>,
    );

    await userEvent.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(addItemToCartMock).toHaveBeenCalledTimes(1);
    expect(addItemToCartMock).toHaveBeenCalledWith("1");
  });
});
