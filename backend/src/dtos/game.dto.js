import Joi from "joi";

export const startGameSchema = Joi.object({
  category: Joi.string().trim().required().messages({
    "string.base": "La categoría debe ser un texto",
    "string.empty": "Elegí una categoría",
    "any.required": "Elegí una categoría",
  }),
  amount: Joi.number().valid(5, 10).required().messages({
    "any.only": "La cantidad de preguntas debe ser 5 o 10",
    "number.base": "La cantidad de preguntas debe ser 5 o 10",
    "any.required": "Elegí la cantidad de preguntas (5 o 10)",
  }),
});

export const answerSchema = Joi.object({
  questionId: Joi.string().required().messages({
    "string.base": "questionId debe ser un texto",
    "string.empty": "Falta questionId",
    "any.required": "Falta questionId",
  }),
  selectedIndex: Joi.number().integer().min(0).max(3).allow(null).required().messages({
    "number.base": "selectedIndex debe ser un número de 0 a 3, o null si se acabó el tiempo",
    "number.integer": "selectedIndex debe ser un número de 0 a 3, o null si se acabó el tiempo",
    "number.min": "selectedIndex debe ser un número de 0 a 3, o null si se acabó el tiempo",
    "number.max": "selectedIndex debe ser un número de 0 a 3, o null si se acabó el tiempo",
    "any.required": "Falta selectedIndex (número de 0 a 3, o null si se acabó el tiempo)",
  }),
});
