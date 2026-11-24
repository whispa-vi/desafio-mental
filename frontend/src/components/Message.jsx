// Caja de mensaje con los estilos del Parcial I: ok, error, info, cargando.
// `items` muestra una lista (por ejemplo, los errores de un formulario).
export default function Message({ type = "info", children, items }) {
  return (
    <div className={`resultado ${type}`} role={type === "error" ? "alert" : "status"}>
      {items && items.length > 0 ? (
        <ul>
          {/* Sin repetidos: el servidor puede enviar el mismo mensaje para varios campos */}
          {[...new Set(items)].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        children
      )}
    </div>
  );
}
