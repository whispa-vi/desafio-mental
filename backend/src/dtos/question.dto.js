import Joi from "joi";

const fields = {
  category: Joi.string().trim().min(2).max(50).messages({
    "string.base": "La categoría debe ser un texto",
    "string.empty": "La categoría es obligatoria",
    "any.required": "La categoría es obligatoria",
    "string.min": "La categoría debe tener entre 2 y 50 caracteres",
    "string.max": "La categoría debe tener entre 2 y 50 caracteres",
  }),
  statement: Joi.string().trim().min(5).max(300).messages({
    "string.base": "El enunciado debe ser un texto",
    "string.empty": "El enunciado es obligatorio",
    "any.required": "El enunciado es obligatorio",
    "string.min": "El enunciado debe tener entre 5 y 300 caracteres",
    "string.max": "El enunciado debe tener entre 5 y 300 caracteres",
  }),
  options: Joi.array()
    .items(Joi.string().trim().min(1).max(150).messages({
      "string.base": "Cada opción debe ser un texto",
      "string.empty": "Las opciones no pueden estar vacías",
      "string.max": "Cada opción puede tener hasta 150 caracteres",
    }))
    .length(4)
    .unique()
    .messages({
      "array.base": "Las opciones deben ser una lista",
      "array.length": "Tiene que haber exactamente 4 opciones",
      "array.unique": "Las opciones no se pueden repetir",
      "any.required": "Las opciones son obligatorias",
    }),
  correctIndex: Joi.number().integer().min(0).max(3).messages({
    "number.base": "La respuesta correcta debe ser un número de 0 a 3",
    "number.integer": "La respuesta correcta debe ser un número de 0 a 3",
    "number.min": "La respuesta correcta debe ser un número de 0 a 3",
    "number.max": "La respuesta correcta debe ser un número de 0 a 3",
    "any.required": "La respuesta correcta es obligatoria",
  }),
  points: Joi.number().integer().min(1).max(100).messages({
    "number.base": "El puntaje debe ser un número entero",
    "number.integer": "El puntaje debe ser un número entero",
    "number.min": "El puntaje debe estar entre 1 y 100",
    "number.max": "El puntaje debe estar entre 1 y 100",
    "any.required": "El puntaje es obligatorio",
  }),
};

export const createQuestionSchema = Joi.object({
  category: fields.category.required(),
  statement: fields.statement.required(),
  options: fields.options.required(),
  correctIndex: fields.correctIndex.required(),
  points: fields.points.required(),
});

export const updateQuestionSchema = Joi.object(fields)
  .min(1)
  .messages({ "object.min": "Enviá al menos un campo para modificar" });
