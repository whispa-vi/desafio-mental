import { useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch.js";
import { questionService } from "../api/services.js";
import FormField from "../components/FormField.jsx";
import Message from "../components/Message.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";

export default function PanelQuestionsPage() {
  const location = useLocation();
  const { data: questions, loading, error, reload } = useFetch(() => questionService.list(), []);
  // El filtro de categoría vive en la URL (?categoria=...) para poder enlazarlo desde el resumen
  const [params, setParams] = useSearchParams();
  const category = params.get("categoria") ?? "";
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(location.state?.message ? { type: "ok", text: location.state.message } : null);

  const categories = useMemo(() => [...new Set((questions ?? []).map((q) => q.category))].sort(), [questions]);

  const visible = useMemo(() => {
    const text = search.trim().toLowerCase();
    return (questions ?? [])
      .filter((q) => !category || q.category === category)
      .filter((q) => !text || q.statement.toLowerCase().includes(text) || q.options.some((o) => o.toLowerCase().includes(text)));
  }, [questions, category, search]);

  const changeCategory = (value) => setParams(value ? { categoria: value } : {});

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await questionService.remove(deleting.id);
      setNotice({ type: "ok", text: "Pregunta eliminada." });
      reload();
    } catch (err) {
      setNotice({ type: "error", text: err.message });
    }
    setBusy(false);
    setDeleting(null);
  };

  return (
    <>
      <header className="panel-header">
        <h1>Preguntas</h1>
        <Link to="/panel/preguntas/nueva" className="btn">Nueva pregunta</Link>
      </header>

      <div className="fila">
        <FormField id="panelCategoria" label="Categoría" as="select" value={category} onChange={(e) => changeCategory(e.target.value)}>
          <option value="">Todas</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </FormField>
        <FormField id="panelBuscar" label="Buscar" type="search" placeholder="Texto de la pregunta u opción" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {notice && <Message type={notice.type}>{notice.text}</Message>}
      {loading && <Message type="cargando">Cargando preguntas...</Message>}
      {error && <ErrorMessage error={error} onRetry={reload} />}

      {questions && (
        <>
          <h2>{visible.length} de {questions.length} preguntas</h2>
          <div className="tabla-scroll">
            <table className="tabla">
              <thead>
                <tr><th>Enunciado</th><th>Categoría</th><th>Respuesta correcta</th><th className="num">Puntaje</th><th></th></tr>
              </thead>
              <tbody>
                {visible.length === 0 && (
                  <tr><td colSpan={5} className="vacia">No hay preguntas que coincidan.</td></tr>
                )}
                {visible.map((q) => (
                  <tr key={q.id}>
                    <td className="enunciado-celda">{q.statement}</td>
                    <td>{q.category}</td>
                    <td>{q.options[q.correctIndex]}</td>
                    <td className="num">{q.points}</td>
                    <td className="acciones-celda">
                      <Link to={`/panel/preguntas/${q.id}`} className="btn ghost sm">Editar</Link>
                      <button type="button" className="btn ghost sm peligro" onClick={() => { setNotice(null); setDeleting(q); }}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {deleting && (
        <ConfirmModal title="¿Eliminar la pregunta?" confirmText="Sí, eliminar" busy={busy} onConfirm={confirmDelete} onCancel={() => setDeleting(null)}>
          «{deleting.statement}» dejará de aparecer en las partidas nuevas. Las partidas ya jugadas la conservan en su historial.
        </ConfirmModal>
      )}
    </>
  );
}
