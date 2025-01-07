export type distributor = {
  fullName: string;
  password: string;
  aadharNumber: string;
  emailId: string;

  phoneNumber: string;

  companyName: string;
  gstNumber: string;

  priorExperience: string;

  panNumber: string;

  shipping_Address: string;

  shipping_Address_city: string;

  shipping_Address_state: string;

  shipping_Address_pincode: string;

  billing_Address: string;

  billing_Address_city: string;

  billing_Address_state: string;

  billing_Address_pincode: string;

  additional_remarks: string;
  attachments: string;
};

export type productCategoary = {
  categoary_type: string;
};

export type userRole = {
  userRole: string;
};
