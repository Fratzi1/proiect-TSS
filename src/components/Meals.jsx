import { use } from "react";
import Meal from "./Meal";
import { MealsContext } from "./meals-context";
import "./../index.css";

export default function Meals() {
  const { meals } = use(MealsContext);

  return (
    <>
      {meals ? (
        <ul id="meals">
          {meals.map((meal) => (
            <li key={meal.id}>
              <Meal meal={meal} />
            </li>
          ))}
        </ul>
      ) : (
        "Nu sunt mancaruri"
      )}
    </>
  );
}
