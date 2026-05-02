import { useActionState, use } from "react";
import { MealsContext } from "./meals-context";
import Submit from "./Submit";
import { calculateTotalAmount, isEmail } from "../util/helper-functions";
import Input from "./Input";

export default function Checkout({ onBack, onAfterOrder }) {
  const { items, addOrder } = use(MealsContext);
  const [formState, formAction] = useActionState(postOrder, {
    errors: null,
  });

  const totalPrice = calculateTotalAmount(items);

  async function postOrder(prevFormData, formData) {
    const name = formData.get("name");
    const email = formData.get("email");
    const street = formData.get("street");
    const postalCode = formData.get("postal-code");
    const city = formData.get("city");

    let errors = [];

    // verificari
    if (!name) {
      errors.push("Username must be filled");
    }

    if (!isEmail(email)) {
      errors.push("Invalid email address");
    }

    if (!postalCode || isNaN(Number(postalCode)) || postalCode.trim() === "") {
      errors.push("Postal code must be a valid number");
    }

    if (!street || !city) {
      errors.push("City and street must be filled");
    }

    if (errors.length > 0) {
      return {
        errors,
        enteredValues: {
          name,
          email,
          street,
          postalCode,
          city,
        },
      };
    }

    await addOrder({
      customer: {
        name,
        email,
        street,
        "postal-code": postalCode,
        city,
      },
    });
    onAfterOrder();
    return { errors: null, enteredValues: {} };
  }

  return (
    <>
      <h2>Checkout</h2>
      <p>Total amount: ${totalPrice}</p>
      <form action={formAction}>
        <Input
          name="name"
          type="text"
          label="Full name"
          defaultValue={formState.enteredValues?.name}
        />

        <Input
          name="email"
          type="email"
          label="E-Mail Address"
          defaultValue={formState.enteredValues?.email}
        />

        <Input
          name="street"
          type="text"
          label="Street"
          defaultValue={formState.enteredValues?.street}
        />

        <div className="control-row">
          <Input
            name="postal-code"
            type="number"
            label="Postal Code"
            defaultValue={formState.enteredValues?.postalCode}
          />

          <Input
            name="city"
            type="text"
            label="City"
            defaultValue={formState.enteredValues?.city}
          />
        </div>

        {formState.errors && (
          <ul className="error">
            {formState.errors.map((errorMessage) => (
              <li key={errorMessage}>{errorMessage}</li>
            ))}
          </ul>
        )}
        <div className="modal-actions">
          <button onClick={onBack} className="text-button">
            Return to cart
          </button>
          <Submit />
        </div>
      </form>
    </>
  );
}
