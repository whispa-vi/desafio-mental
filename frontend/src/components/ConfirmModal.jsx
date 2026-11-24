import Modal from "./Modal.jsx";

// Confirmación (reemplaza a confirm() del Parcial I)
export default function ConfirmModal({ title, children, confirmText, onConfirm, onCancel, busy }) {
  return (
    <Modal title={title} onClose={busy ? undefined : onCancel}>
      <p className="modal-texto">{children}</p>
      <div className="acciones">
        <button type="button" className="btn" onClick={onConfirm} disabled={busy} autoFocus>
          {confirmText}
        </button>
        <button type="button" className="btn ghost" onClick={onCancel} disabled={busy}>
          Cancelar
        </button>
      </div>
    </Modal>
  );
}
