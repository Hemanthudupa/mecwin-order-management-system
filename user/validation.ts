import Joi from "joi";
export const loginValidation = Joi.object({
  phoneNumber: Joi.string().disallow(null).length(10).optional().messages({
    "string.base": "username should be string",
    "any.required": " username is a required field ",
  }),
  email: Joi.string().disallow(null).optional().messages({
    "string.base": "emailId should be string",
    "any.required": " emailId is a required field ",
  }),
  password: Joi.string().disallow(null).required().messages({
    "string.base": "username should be string",
    "any.required": " username is a required field ",
  }),
});
