export const USER_ROLES = {
  consumer: "CONSUMER",
  systemAdmin: "SYSTEM ADMIN",
  distributor: "DISTRIBUTOR",
  manager: "MANAGER",
  executive: "EXECUTIVE",
};
export const PRODUCTS_CATEGOARY = {
  solar_pumps: "SOLAR PUMPS",
  dc_motor: "DC_MOTOR",
};

export const MANAGERS_ROLES = {
  sales: "SALES",
  stores: "STORES",
  winding: "WINDING",
  assembly: "ASSEMBLY",
  testing: "TESTING",
  packing: "PACKING",
};

export const order_status = {
  submitted: "Submitted",
  inProgress: "In Progress",
  PendingAcceptance: "PENDING ACCEPTANCE",
  OrderConfirmed: "Order Confirmed",
  ProductionInProgress: "Production In Progress",
  DispatchInProgress: "Dispatch In Progress",
  OredrShipped: "Order Shipped",
  Delivered: "Delivered",
} as const;

export const sales_negotiation_status = {
  assigned: "ASSIGNED",
  negotiated: "NEGOTIATED",
  rejected: "REJECTED",
  pending_acceptance: "PENDING ACCEPTANCE",
};
