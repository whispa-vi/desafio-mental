// Encabezado de sección (bloque «bienvenida» del Parcial I)
export default function PageHeader({ title, children }) {
  return (
    <div className="bienvenida">
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </div>
  );
}
