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
  // headSize: Joi.number().integer().positive().optional().messages({
  //   "number.base": "Head size must be a number",
  //   "number.positive": "Head size must be positive",
  //   "any.required": "Head size is required",
  // }),
  // motorType: Joi.string()
  //   // .valid("AC Motor", "DC Motor")
  //   .optional()
  //   .messages({
  //     "string.base": "Motor type must be a string",
  //     "any.only": "Motor type must be 'AC Motor' or 'DC Motor'",
  //     "any.required": "Motor type is required",
  //   }),
  // current: Joi.string()
  //   // .pattern(/^\d+(\.\d+)?[A]$/)
  //   .optional()
  //   .messages({
  //     "string.pattern.base": "Current must be a valid string like '5A'",
  //     "any.required": "Current is required",
  //   }),
  // diameter: Joi.string()
  //   // .pattern(/^\d+(mm|cm|in)$/)
  //   .optional()
  //   .messages({
  //     "string.pattern.base":
  //       "Diameter must be a valid string like '30mm', '20cm', or '10in'",
  //     "any.required": "Diameter is required",
  //   }),
  // pannelType: Joi.string()
  //   // .valid("Solar", "Electric", "Hybrid")
  //   .optional()
  //   .messages({
  //     "any.only": "Pannel type must be 'Solar', 'Electric', or 'Hybrid'",
  //     "any.required": "Pannel type is required",
  //   }),
  // spd: Joi.string()
  //   // .pattern(/^\d+\sRPM$/)
  //   .optional()
  //   .messages({
  //     "string.pattern.base": "SPD must be a valid string like '1500 RPM'",
  //     "any.required": "SPD is required",
  //   }),
  // data: Joi.string().optional().messages({
  //   "string.base": "Data must be a string",
  // }),
  // warranty: Joi.string()
  //   // .pattern(/^\d+\s(Year|Years|Month|Months)$/)
  //   .optional()
  //   .messages({
  //     "string.pattern.base":
  //       "Warranty must be a valid string like '2 Years' or '6 Months'",
  //     "any.required": "Warranty is required",
  //   }),
  // transportation: Joi.string()
  //   // .valid("By Road", "By Air", "By Sea")
  //   .optional()
  //   .messages({
  //     "any.only": "Transportation must be 'By Road', 'By Air', or 'By Sea'",
  //     "any.required": "Transportation is required",
  //   }),
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
  sap_reference_number: Joi.string().required().messages({
    "string.base": " sap reference is a required field ",
    "any.required": " sap reference  is required ",
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

export const validateLineItemsData = Joi.object({
  orderId: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "guid.base": " orderId should be an proper GUID id type ",
    "any.required": "orderId cannot be empty",
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
  // sap_reference_number: Joi.string().required().messages({
  //   "string.base": " sap reference is a required field ",
  //   "any.required": " sap reference  is required ",
  // }),
  uom: Joi.string().required().messages({
    "string.base": " uom should be an proper string ",
    "any.required": " uom is requried field",
  }),
  motor_type: Joi.string().required().messages({
    "number.base": " motor_type should be an proper string ",
    "any.required": " motor_type is requried field",
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
  // deadline: Joi.date().required().messages({
  //   "date.base": " deadline should be an proper date type  ",
  //   "any.required": " deadline is requried field",
  // }),

  advanceAmount: Joi.number().required().messages({
    "number.base": " advanceAmount should be an proper number ",
    "any.required": " advanceAmount is requried field",
  }),
});
