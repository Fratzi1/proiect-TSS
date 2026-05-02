import { useFormStatus } from "react-dom"; // nu poti folosi in componenta unde e functia noastra

export default function Submit() {
    const { pending } = useFormStatus();
  
    return (
      <button type="submit" disabled={pending} className="button">
        {pending ? 'Placing order ...' : 'Order'}
    </button>
  );
}
