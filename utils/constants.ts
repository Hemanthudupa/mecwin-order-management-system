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
  acceptanceRejected: "Acceptance Rejected",
} as const;

export const product_status = {
  to_be_processed: "To Be Processed",
  assigned: "Assigned",
  negotiation: "Negotiation",
  PendingAcceptance: "PENDING ACCEPTANCE",
  OrderConfirmed: "Order Confirmed",
  pending_approval: "Pending Approval",
  pending_payment_confirmantion: "Pending Payment Confirmantion",
  pending_planning_confirmantion: "Pending Planning Confirmantion",
  acceptanceRejected: "Acceptance Rejected",
  planning_for_material_issue: "Planning for Material Issue",
  material_issue_in_progress: "Material Issue In-Progress",
  pending_for_winding: "Pending for Winding",
  winding_in_progress: "Winding In-Progress",
  winding_quality_check: "Winding Quality Check",
  pending_for_assembly: "Pending for Assembly",
  assembly_in_progress: "Assembly In-Progress",
  assembly_quality_check: "Assembly Quality Check",
  pending_for_testing: "Pending for Testing",
  testing_in_progress: "Testing In-Progress",
  pending_for_packing: "Pending for Packing",
  packaging_in_progress: "Packaging In-Progress",
  packaging_quality_check: "Packaging Quality Check",
  pending_account_confirmation: "Pending Account Confirmation",
  ready_for_dispatch: "Ready for Dispatch",
  dispatched: "Dispatched",
  shipped: "Shipped",
  accepted: "Accepted",
} as const;

export const sales_negotiation_status = {
  assigned: "ASSIGNED",
  negotiated: "NEGOTIATED",
  rejected: "REJECTED",
  pending_acceptance: "PENDING ACCEPTANCE",
};

// export const  = {
//   assigned: "ASSIGNED",
//   negotiated: "NEGOTIATED",
//   rejected: "REJECTED",
//   pending_acceptance: "PENDING ACCEPTANCE",
// };
