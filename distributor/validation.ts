import Joi from "joi";

export const validateDistributor = Joi.object({
  fullName: Joi.string().required().messages({
    "string.base": "fullname should be string ",
    "required.any": "firstname should be valid",
  }),
  password: Joi.string().required().messages({
    "string.base": "password should be string ",
    "required.any": "password should be valid",
  }),
  aadharNumber: Joi.string().required().messages({
    "string.base": "aadharNumber should be string ",
    "required.any": "aadharNumber should be valid",
  }),
  email: Joi.string().required().messages({
    "string.base": "email should be string ",
    "required.any": "email should be valid",
  }),
  phoneNumber: Joi.string().required().messages({
    "string.base": "phoneNumber should be string ",
    "required.any": "phoneNumber should be valid",
  }),
  companyName: Joi.string().required().messages({
    "string.base": "companyName should be string ",
    "required.any": "companyName should be valid",
  }),
  gstNumber: Joi.string().required().messages({
    "string.base": "gstNumber should be string ",
    "required.any": "gstNumber should be valid",
  }),
  priorExperience: Joi.string().required().messages({
    "string.base": "priorExperience should be string ",
    "required.any": "priorExperience should be valid",
  }),
  panNumber: Joi.string().required().messages({
    "string.base": "panNumber should be string ",
    "required.any": "aadharNumber should be valid",
  }),

  shipping_Address: Joi.string().required().messages({
    "string.base": "shipping_Address should be string ",
    "required.any": "shipping_Address should be valid",
  }),

  shipping_Address_city: Joi.string().required().messages({
    "string.base": "shipping_Address_city should be string ",
    "required.any": "shipping_Address_city should be valid",
  }),
  shipping_Address_state: Joi.string().required().messages({
    "string.base": "shipping_Address_state should be string ",
    "required.any": "shipping_Address_state should be valid",
  }),
  shipping_Address_pincode: Joi.string().required().messages({
    "string.base": "shipping_Address_pincode should be string ",
    "required.any": "shipping_Address_pincode should be valid",
  }),
  billing_Address: Joi.string().required().messages({
    "string.base": "billing_Address should be string ",
    "required.any": "billing_Address should be valid",
  }),

  billing_Address_city: Joi.string().required().messages({
    "string.base": "billing_Address_city should be string ",
    "required.any": "billing_Address_city should be valid",
  }),
  billing_Address_state: Joi.string().required().messages({
    "string.base": "billing_Address_state should be string ",
    "required.any": "billing_Address_state should be valid",
  }),
  billing_Address_pincode: Joi.string().required().messages({
    "string.base": "billing_Address_pincode should be string ",
    "required.any": "billing_Address_pincode should be valid",
  }),
  additional_remarks: Joi.string().required().messages({
    "string.base": "additional_remarks should be string ",
    "required.any": "additional_remarks should be valid",
  }),
  attachments: Joi.any().optional().messages({
    "required.any": "attachments should be valid",
  }),
});

export const orderDetails = Joi.object({
  shipping_Address: Joi.string().optional().messages({
    "string.base": "shippingAddress should be an valid string ",
    "required.any": "shippingAddress should be valid ",
  }),
  billing_Address: Joi.string().optional().messages({
    "string.base": "billingAddress should be an valid string ",
    "required.any": "billingAddress should be valid ",
  }),
  remarks: Joi.string().optional().messages({
    "string.base": "remarks should be an valid string ",
    "required.any": "remarks should be valid ",
  }),
});
