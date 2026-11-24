import Message from "./Message.jsx";

// Error de una petición con botón para reintentar
export default function ErrorMessage({ error, onRetry }) {
  return (
    <>
      <Message type="error">{error.message}</Message>
      {onRetry && (
        <button type="button" className="btn ghost sm reintentar" onClick={onRetry}>
          Volver a intentar
        </button>
      )}
    </>
  );
}
