import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch.js";
import { questionService } from "../api/services.js";
import FormField from "../components/FormField.jsx";
import Message from "../components/Message.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const EMPTY = { category: "", statement: "", options: ["", "", "", ""], correctIndex: 0, points: 10 };

// Una página para crear (/panel/preguntas/nueva) y editar (/panel/preguntas/:id)
export default function PanelQuestionFormPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  const question = useFetch(() => (editing ? questionService.get(id) : Promise.resolve(null)), [id]);
  const categories = useFetch(() => questionService.categories(), []);

  if (question.loading) return <Message type="cargando">Cargando pregunta...</Message>;
  if (question.error) return <ErrorMessage error={question.error} onRetry={question.reload} />;

  return (
    <>
      <header className="panel-header">
        <h1>{editing ? "Modificar pregunta" : "Nueva pregunta"}</h1>
        <Link to="/panel/preguntas" className="btn ghost">Volver a la lista</Link>
      </header>
      {/* key: al cambiar de pregunta el formulario arranca con sus datos */}
      <QuestionForm
        key={id ?? "nueva"}
        initial={question.data ?? EMPTY}
        id={id}
        categories={(categories.data ?? []).map((c) => c.category)}
      />
    </>
  );
}

function QuestionForm({ initial, id, categories }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    category: initial.category,
    statement: initial.statement,
    options: [...initial.options],
    correctIndex: initial.correctIndex,
    points: initial.points,
  });
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  const setField = (field, value) => setForm({ ...form, [field]: value });
  const setOption = (index, value) => setField("options", form.options.map((o, i) => (i === index ? value : o)));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const data = { ...form, points: Number(form.points) };
    try {
      if (id) {
        await questionService.update(id, data);
      } else {
        await questionService.create(data);
      }
      navigate("/panel/preguntas", { state: { message: id ? "Pregunta modificada." : "Pregunta creada." } });
    } catch (error) {
      setErrors(error.errors.length > 0 ? error.errors.map((e) => e.message) : [error.message]);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-pregunta card" noValidate>
      <FormField id="qCategory" label="Categoría" list="lista-categorias" value={form.category} onChange={(e) => setField("category", e.target.value)} />
      <datalist id="lista-categorias">
        {categories.map((c) => <option key={c} value={c} />)}
      </datalist>

      <div className="campo">
        <label htmlFor="qStatement">Enunciado</label>
        <textarea id="qStatement" rows={3} value={form.statement} onChange={(e) => setField("statement", e.target.value)} />
      </div>

      <fieldset className="opciones-form">
        <legend>Opciones (marcá la correcta)</legend>
        {form.options.map((option, index) => (
          <div key={index} className="opcion-form">
            <input
              type="radio"
              name="correcta"
              id={`qCorrect${index}`}
              checked={form.correctIndex === index}
              onChange={() => setField("correctIndex", index)}
              aria-label={`Opción ${index + 1} es la correcta`}
            />
            <input type="text" id={`qOption${index}`} value={option} placeholder={`Opción ${index + 1}`} onChange={(e) => setOption(index, e.target.value)} />
          </div>
        ))}
      </fieldset>

      <FormField id="qPoints" label="Puntaje" type="number" min={1} max={100} value={form.points} onChange={(e) => setField("points", e.target.value)} />

      {errors.length > 0 && <Message type="error" items={errors} />}

      <div className="acciones">
        <button type="submit" className="btn" disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button>
        <Link to="/panel/preguntas" className="btn ghost">Cancelar</Link>
      </div>
    </form>
  );
}
