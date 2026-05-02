import "./../index.css";
import { use } from "react";
import { MealsContext } from "./meals-context";

export default function Meal({
  meal: { id, name, price, description, image },
}) {
  
  const {addItemToCart} = use(MealsContext);

  const imagePath = "./../../backend/public/" + image;
  const formattedTotalPrice = `$${Number(price).toFixed(2)}`;

  return (
    <div className="meal-item">
      <img src={imagePath} alt="No image found" />
      <h3>{name}</h3>
      <p className="meal-item-price">{formattedTotalPrice}</p>
      <article>
        <p className="meal-item-description">{description}</p>
      </article>
      <button className="meal-item-actions button" onClick={() => addItemToCart(id)}>
        Add to cart
      </button>
    </div>
  );
}
