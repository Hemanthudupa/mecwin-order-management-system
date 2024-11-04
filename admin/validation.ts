import Joi from "joi";

export const validation_Product_Categoary = Joi.object({
  categoary_type: Joi.string().required().messages({
    "string.base": "categoary_type should be valid string ",
    "any.required": " categoary_type is required cannot be empty",
  }),
});

export const validation_User_Role = Joi.object({
  userRole: Joi.string().required().messages({
    "string.base": "userRole should be valid string ",
    "any.required": " userRole is required cannot be empty",
  }),
});
export const validation_product_details = Joi.object({
  product_categoary: Joi.string()
    .guid({
      version: "uuidv4",
    })
    .required()
    .messages({
      "guid.base": "product_categoary should be an valid id of categoary",
      "string.guid": "product_categoary should be an valid string  of id ",
      "any.required": "product_categoary is an required field ",
    }),
  details: Joi.string().required().messages({
    "string.base": "details should be valid string ",
    "any.required": " details is required cannot be empty",
  }),
  gst: Joi.number().required().messages({
    "number.base": "gst should be valid number ",
    "any.required": " gst is required cannot be empty",
  }),
  price: Joi.number().required().messages({
    "number.base": "price should be valid number ",
    "any.required": " price is required cannot be empty",
  }),
  discount: Joi.number().required().messages({
    "number.base": "discount should be valid number ",
    "any.required": " discount is required cannot be empty",
  }),
  product_name: Joi.string().required().messages({
    "string.base": "product_name should be valid string ",
    "any.required": " product_name is required cannot be empty",
  }),
});
