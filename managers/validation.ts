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

export const validateSearchOptions = Joi.object({
  orderid: Joi.string()
    .guid({
      version: "uuidv4",
    })
    .optional()
    .messages({
      "guid.base": "orderid should be valid UUID id ",
    }),
  customerid: Joi.string().optional().messages({
    "string.base": "customerid should be string",
  }),
  employeeId: Joi.string().optional().messages({
    "string.base": "employeeId should be string",
  }),
});

export const validateAssignStoresExecutive = Joi.object({
  orderId: Joi.string()
    .guid({
      version: "uuidv4",
    })
    .required()
    .messages({
      "guid.base": "orderid should be valid UUID id ",
    }),
  storesExecutivesId: Joi.string()
    .guid({
      version: "uuidv4",
    })
    .optional()
    .messages({
      "guid.base": "storesExecutivesId should be valid UUID id ",
    }),
});
