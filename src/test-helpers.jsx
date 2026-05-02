import { render } from "@testing-library/react";
import { MealsContext } from "./components/meals-context";
import Meals from "./components/Meals";
import Header from "./components/Header";

export function renderMeals(meals) {
  return render(
    <MealsContext
      value={{
        meals,
        items: [],
        addItemToCart: vi.fn(),
        updateItemQuantity: vi.fn(),
        addOrder: vi.fn(),
      }}
    >
      <Header />
      <main>
        <Meals />
      </main>
    </MealsContext>,
  );
}
