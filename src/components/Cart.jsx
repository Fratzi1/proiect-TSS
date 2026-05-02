import { use } from "react";
import { MealsContext } from "./meals-context";
import "./../index.css";
import { calculateTotalAmount } from "../util/helper-functions";

export default function Cart({ onCheckout }) {
  const { items, updateItemQuantity } = use(MealsContext);

  const totalPrice = calculateTotalAmount(items);

  const formattedTotalPrice = `$${totalPrice.toFixed(2)}`;
  console.log(items);
  return (
    <div className="cart">
      <h2>Cart</h2>
      {items.length === 0 && <p>No items in the cart!</p>}
      {items.length > 0 && (
        <ul>
          {items.map((item) => (
            <li key={item.id} className="cart-item">
              <p>
                {item.name} - {item.quantity} x ${item.price}
              </p>
              <div className="cart-item-actions">
                <button onClick={() => updateItemQuantity(item.id, -1)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateItemQuantity(item.id, 1)}>
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="cart-total">
        <strong>{formattedTotalPrice}</strong>
      </p>
      <form method="dialog" className="modal-actions">
        <button className="text-button">Close</button>
        {totalPrice !== 0 && (
          <button className="button" onClick={onCheckout}>
            Checkout
          </button>
        )}
      </form>
    </div>
  );
}
