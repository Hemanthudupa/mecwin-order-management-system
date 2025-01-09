import Joi from "joi";
export const validateAddDeadline = Joi.object({
  orderId: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "guid.base": " orderId should be an proper GUID id type ",
    "any.required": "orderId cannot be empty",
  }),
  id: Joi.string()
    .guid({
      version: "uuidv4",
    })
    .required()
    .messages({
      "guid.base": "id should be valid UUID  ",
      "string.base": " id should be valid option of string ",
      "any.required": " id  is required ",
    }),
  uom: Joi.string().required().messages({
    "string.base": " uom should be an proper string ",
    "any.required": " uom is requried field",
  }),
  motorType: Joi.string().required().messages({
    "number.base": " motorType should be an proper string ",
    "any.required": " motorType is requried field",
  }),
  headSize: Joi.string().required().messages({
    "string.base": " headSize should be an proper string ",
    "any.required": " headSize is requried field",
  }),
  current: Joi.string().required().messages({
    "string.base": " current should be an proper string ",
    "any.required": " current is requried field",
  }),
  diameter: Joi.string().required().messages({
    "string.base": " diameter should be an proper string ",
    "any.required": " diameter is requried field",
  }),
  pannel_type: Joi.string().required().messages({
    "string.base": " pannel_type should be an proper string ",
    "any.required": " pannel_type is requried field",
  }),
  spd: Joi.boolean().required().messages({
    "boolean.base": " spd should be an proper boolean ",
    "any.required": " spd is requried field",
  }),
  data: Joi.boolean().required().messages({
    "boolean.base": " data should be an proper boolean ",
    "any.required": " data is requried field",
  }),
  warranty: Joi.boolean().required().messages({
    "boolean.base": " warranty should be an proper boolean ",
    "any.required": " warranty is requried field",
  }),
  transportation: Joi.boolean().required().messages({
    "boolean.base": " transportation should be an proper boolean ",
    "any.required": " transportation is requried field",
  }),
  price: Joi.number().required().messages({
    "number.base": " price should be an proper number ",
    "any.required": " price is requried field",
  }),
  quantity: Joi.number().required().messages({
    "number.base": " quantity should be an proper number ",
    "any.required": " quantity is requried field",
  }),
  deadLine: Joi.date().required().messages({
    "date.base": " deadLine should be an proper date type  ",
    "any.required": " deadLine is requried field",
  }),
});
