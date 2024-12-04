import Joi from "joi";

export const validateOrderUpdateDetails = Joi.object({
  payment_terms: Joi.string().required().messages({
    "string.empty": "payment_terms cannot be empty",
    "any.required": "payment_terms should be valid ",
  }),
  productId: Joi.string().guid().optional().messages({
    "guid.base": "productId should be an valid UUID format ",
    "any.required": "productId should be valid ",
  }),
});
