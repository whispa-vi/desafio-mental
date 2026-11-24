import { useEffect } from "react";
import { createPortal } from "react-dom";

// Ventana modal con React Portal: se dibuja en #modal-root, fuera del árbol de la página.
export default function Modal({ title, children, onClose }) {
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className="modal-fondo" onClick={onClose}>
      <div className="modal card" role="dialog" aria-modal="true" aria-labelledby="modal-titulo" onClick={(e) => e.stopPropagation()}>
        <h2 id="modal-titulo" className="modal-titulo">{title}</h2>
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
