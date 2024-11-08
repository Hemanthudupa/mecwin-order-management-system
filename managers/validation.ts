import Joi from "joi";

export const validatorAssignSalesExecutor = Joi.object({
  salesExecutivesId: Joi.string()
    .guid({ version: "uuidv4" })
    .required()
    .messages({
      "guid.base": " salesExecutivesId should be valid string of ID ",
      "any.required": "salesExecutivesId is required field ",
    }),
  orderId: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "guid.base": " orderId should be valid string of ID ",
    "any.required": "orderId is required field ",
  }),
});
