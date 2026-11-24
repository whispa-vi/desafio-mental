import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().trim().min(4).max(16).required().messages({
    "string.empty": "El nombre de usuario es obligatorio",
    "any.required": "El nombre de usuario es obligatorio",
    "string.min": "El nombre de usuario debe tener entre 4 y 16 caracteres",
    "string.max": "El nombre de usuario debe tener entre 4 y 16 caracteres",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.empty": "El email es obligatorio",
    "any.required": "El email es obligatorio",
    "string.email": "El email no tiene un formato válido",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "La contraseña es obligatoria",
    "any.required": "La contraseña es obligatoria",
    "string.min": "La contraseña debe tener al menos 8 caracteres",
  }),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Las contraseñas no coinciden",
    "any.required": "Confirmá la contraseña",
  }),
});

export const loginSchema = Joi.object({
  username: Joi.string().trim().required().messages({
    "string.empty": "El nombre de usuario es obligatorio",
    "any.required": "El nombre de usuario es obligatorio",
  }),
  password: Joi.string().required().messages({
    "string.empty": "La contraseña es obligatoria",
    "any.required": "La contraseña es obligatoria",
  }),
});
