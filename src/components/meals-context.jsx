import { createContext, useEffect, useReducer, useState } from "react";
import { calculateTotalAmount } from "../util/helper-functions";

export const MealsContext = createContext({
  meals: null,
  items: [],
  addItemToCart: () => {},
  updateItemQuantity: () => {},
  addOrder: (order) => {},
});

function cartReduce(state, action) {
  if (action.type === "ADD_ITEM") {
    const updatedItems = [...state.items];

    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === action.payload.id
    );
    const existingCartItem = updatedItems[existingCartItemIndex];

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      const product = action.payload.meal;
      updatedItems.push({
        id: action.payload.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
    }

    return {
      ...state,
      items: updatedItems,
    };
  }
  if (action.type === "UPDATE_ITEM") {
    const updatedItems = [...state.items];
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === action.payload.productId
    );

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };

    updatedItem.quantity += action.payload.amount;

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      updatedItems[updatedItemIndex] = updatedItem;
    }

    return {
      ...state,
      items: updatedItems,
    };
  }

  if (action.type === "RESET_ITEMS") {
    return {
      ...state,
      items: [], // Don't mutate state directly
    };
  }

  return state;
}

export function MealsContextProvider({ children }) {
  const [meals, setMeals] = useState();
  const [cartState, cartDispatch] = useReducer(cartReduce, {
    items: [],
  });

  // Se apeleaza o data pt a lua datele din backend (GET)
  useEffect(() => {
    async function loadMeals() {
      try {
        const response = await fetch("http://localhost:3000/meals");
        if (!response.ok) {
          return;
        }
        const meals = await response.json();
        setMeals(meals);
      } catch {
        // network unavailable — meals stay undefined
      }
    }
    loadMeals();
  }, []);

  // Functie de postare a comenzilor (POST)
  async function addOrder(order) {
    const totalPrice = calculateTotalAmount(cartState.items);

    const attachedOrder = {
      order: {
        customer: order.customer,
        items: cartState.items,
        totalprice: totalPrice,
      },
    };

    const response = await fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(attachedOrder),
    });
    if (!response.ok) {
      return;
    }
    handleResetCart();
  }

  // 2 functii care merg prin reducer pt a adauga / updata elementele din cos
  function handleAddItemToCart(id) {
    const meal = meals.find((meal) => meal.id === id);
    cartDispatch({
      type: "ADD_ITEM",
      payload: { id, meal },
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    cartDispatch({
      type: "UPDATE_ITEM",
      payload: {
        productId,
        amount,
      },
    });
  }

  function handleResetCart() {
    cartDispatch({
      type: "RESET_ITEMS",
    });
  }

  const contextValue = {
    meals: meals,
    items: cartState.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity,
    addOrder,
  };

  return <MealsContext value={contextValue}>{children}</MealsContext>;
}
