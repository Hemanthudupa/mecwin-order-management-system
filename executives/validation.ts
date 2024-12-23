import Joi from "joi";

export const validateOrderUpdateDetails = Joi.object({
  orderId: Joi.string()
    .guid({
      version: "uuidv4",
    })
    .required()
    .messages({
      "guid.base": "orderId should be valid UUID  ",
      "any.required": "orderId required ",
    }),
  headSize: Joi.number().integer().positive().optional().messages({
    "number.base": "Head size must be a number",
    "number.positive": "Head size must be positive",
    "any.required": "Head size is required",
  }),
  motorType: Joi.string()
    // .valid("AC Motor", "DC Motor")
    .optional()
    .messages({
      "string.base": "Motor type must be a string",
      "any.only": "Motor type must be 'AC Motor' or 'DC Motor'",
      "any.required": "Motor type is required",
    }),
  current: Joi.string()
    // .pattern(/^\d+(\.\d+)?[A]$/)
    .optional()
    .messages({
      "string.pattern.base": "Current must be a valid string like '5A'",
      "any.required": "Current is required",
    }),
  diameter: Joi.string()
    // .pattern(/^\d+(mm|cm|in)$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Diameter must be a valid string like '30mm', '20cm', or '10in'",
      "any.required": "Diameter is required",
    }),
  pannelType: Joi.string()
    // .valid("Solar", "Electric", "Hybrid")
    .optional()
    .messages({
      "any.only": "Pannel type must be 'Solar', 'Electric', or 'Hybrid'",
      "any.required": "Pannel type is required",
    }),
  spd: Joi.string()
    // .pattern(/^\d+\sRPM$/)
    .optional()
    .messages({
      "string.pattern.base": "SPD must be a valid string like '1500 RPM'",
      "any.required": "SPD is required",
    }),
  data: Joi.string().optional().messages({
    "string.base": "Data must be a string",
  }),
  warranty: Joi.string()
    // .pattern(/^\d+\s(Year|Years|Month|Months)$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Warranty must be a valid string like '2 Years' or '6 Months'",
      "any.required": "Warranty is required",
    }),
  transportation: Joi.string()
    // .valid("By Road", "By Air", "By Sea")
    .optional()
    .messages({
      "any.only": "Transportation must be 'By Road', 'By Air', or 'By Sea'",
      "any.required": "Transportation is required",
    }),
  payment_terms: Joi.string()
    .guid({
      version: "uuidv4",
    })
    .required()
    .messages({
      "guid.base": "payment_terms should be valid UUID  ",
      "string.base": " payment_terms should be valid option of string ",
      "any.required": " payment_terms  is required ",
    }),
});

export const validateScanningData = Joi.object({
  totalScanned: Joi.number().required().messages({
    "number.base": "totalScanned should be number type ",
    "any.required": " totalScanned  is required ",
  }),
  unitUniqueId: Joi.string().required().messages({
    "string.base": "unitUniqueId should be string type ",
    "any.required": " unitUniqueId  is required ",
  }),
  productId: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "guid.base": " productId should be an valid UUID format ",
    "any.required": "productId is required",
  }),

  current: Joi.string().required().messages({
    "string.base": "current should be string type ",
    "any.required": " current  is required ",
  }),
  productName: Joi.string().required().messages({
    "string.base": "productName should be string type ",
    "any.required": " productName  is required ",
  }),

  headSize: Joi.string().required().messages({
    "string.base": "headSize should be string type ",
    "any.required": " headSize  is required ",
  }),

  motorHp: Joi.string().required().messages({
    "string.base": "motorHp should be string type ",
    "any.required": " motorHp  is required ",
  }),
  netQuantity: Joi.number().required().messages({
    "number.base": "netQuantity should be number type ",
    "any.required": " netQuantity  is required ",
  }),
});
