import { screen } from "@testing-library/react";
import { renderMeals } from "../test-helpers.jsx";

describe("test Meals component", () => {
  test("renders several meals from context", () => {
    renderMeals([
      {
        id: "1",
        name: "Fasole batuta",
        price: "20",
        description: "Este o mancare foarte gustoasa.",
        image: "test-1.jpg",
      },
      {
        id: "2",
        name: "Ciorba de burta",
        price: "30",
        description: "Este o ciorba foarte buna.",
        image: "test-2.jpg",
      },
    ]);

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText(/fasole batuta/i)).toBeInTheDocument();
    expect(screen.getByText(/ciorba de burta/i)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(
      screen.getAllByRole("button", { name: /add to cart/i }),
    ).toHaveLength(2);
  });

  test("renders fallback message when meals is undefined", () => {
    renderMeals(undefined);

    expect(screen.getByText(/nu sunt mancaruri/i)).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  test("renders an empty list when meals is an empty array", () => {
    renderMeals([]);

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.queryByText(/nu sunt mancaruri/i)).not.toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
