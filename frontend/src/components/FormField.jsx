// Etiqueta + campo. Acepta input (por defecto) o select (con children).
export default function FormField({ id, label, as = "input", children, ...props }) {
  const Field = as;
  return (
    <div className="campo">
      <label htmlFor={id}>{label}</label>
      <Field id={id} name={id} {...props}>
        {children}
      </Field>
    </div>
  );
}
