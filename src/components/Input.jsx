export default function Input({ name, type, label, defaultValue }) {
  return (
    <p className="control">
      <label htmlFor={name}>{label}</label>
      <input type={type} id={name} name={name} defaultValue={defaultValue} />
    </p>
  );
}
