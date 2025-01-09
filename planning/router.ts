import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  addDeadLineToOrdersByPlanning,
  getAllOrders,
  getPlanningOrdersById,
} from "./module";
import { ensurePlanning } from "../utils/authentication";
import { Router } from "express";
let route = Router();
route.use(ensurePlanning);

/**
 * @swagger
 * /planning/get-all-orders:
 *   get:
 *     summary: Retrieve all orders
 *     tags:
 *       - Planning
 *     description: Fetches all orders from the database that meet specific criteria. The response includes all details of each order.
 *     responses:
 *       '200':
 *         description: Successfully retrieved all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     description: The unique identifier of the order
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                   customerId:
 *                     type: string
 *                     format: uuid
 *                     description: The unique identifier of the customer
 *                     example: "abc12345-e89b-12d3-a456-426614174001"
 *                   productId:
 *                     type: string
 *                     format: uuid
 *                     description: The unique identifier of the product
 *                     example: "def12345-e89b-12d3-a456-426614174002"
 *                   quantity:
 *                     type: number
 *                     description: Total quantity in the order
 *                     example: 100
 *                   price:
 *                     type: number
 *                     description: Total price of the order
 *                     example: 5000.00
 *                   sap_reference_number:
 *                     type: string
 *                     description: SAP reference number for the order
 *                     example: "SAP123456"
 *                   shipping_Address:
 *                     type: string
 *                     description: Shipping address for the order
 *                     example: "123 Main St, City, State"
 *                   billing_Address:
 *                     type: string
 *                     description: Billing address for the order
 *                     example: "456 Another St, City, State"
 *                   reason:
 *                     type: string
 *                     description: Reason for the order
 *                     example: "Bulk order"
 *                   discount:
 *                     type: number
 *                     description: Discount applied to the order
 *                     example: 10.5
 *                   remarks:
 *                     type: string
 *                     description: Additional remarks for the order
 *                     example: "Urgent delivery required"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The creation timestamp of the order
 *                     example: "2024-01-01T12:00:00Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The last updated timestamp of the order
 *                     example: "2024-01-02T15:30:00Z"
 *                   deadLine:
 *                     type: string
 *                     format: date
 *                     description: Deadline for the order
 *                     example: "2024-12-31"
 *                   advanceAmount:
 *                     type: boolean
 *                     description: Indicates if an advance amount is applicable
 *                     example: true
 *                   payment_terms:
 *                     type: string
 *                     format: uuid
 *                     description: Payment terms identifier
 *                     example: "2abfc2e9-3ae6-4e59-8dcd-4ff397dae474"
 *                   approved_by_sales:
 *                     type: boolean
 *                     description: Indicates if the order is approved by the sales team
 *                     example: true
 *                   approved_by_accounts:
 *                     type: boolean
 *                     description: Indicates if the order is approved by the accounts team
 *                     example: true
 *                   approved_by_planning:
 *                     type: boolean
 *                     description: Indicates if the order is approved by the planning team
 *                     example: false
 *                   approved_by_customer:
 *                     type: boolean
 *                     description: Indicates if the order is approved by the customer
 *                     example: false
 *                   approved_by_stores:
 *                     type: boolean
 *                     description: Indicates if the order is approved by the stores
 *                     example: true
 *                   order_status:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Array of statuses for the order
 *                     example: ["pending", "approved"]
 *                   product_status:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Array of statuses for the product
 *                     example: ["manufacturing", "delivered"]
 *                   isActive:
 *                     type: boolean
 *                     description: Indicates if the order is active
 *                     example: true
 *                   headSize:
 *                     type: number
 *                     description: Head size of the motor in the order
 *                     example: 50
 *                   motorType:
 *                     type: string
 *                     description: Type of motor
 *                     example: "AC"
 *                   current:
 *                     type: string
 *                     description: Current specification
 *                     example: "100A"
 *                   diameter:
 *                     type: string
 *                     description: Diameter of the motor
 *                     example: "10cm"
 *                   pannelType:
 *                     type: string
 *                     description: Type of panel
 *                     example: "Solar"
 *                   spd:
 *                     type: string
 *                     description: SPD (Surge Protection Device) type
 *                     example: "Type-II"
 *                   data:
 *                     type: string
 *                     description: Additional data associated with the order
 *                     example: "Specs available"
 *                   warranty:
 *                     type: string
 *                     description: Warranty information
 *                     example: "2 years"
 *                   transportation:
 *                     type: string
 *                     description: Transportation method
 *                     example: "By Road"
 *                   sales_negotiation_status:
 *                     type: string
 *                     description: Status of sales negotiation
 *                     example: "pending_acceptance"
 *                   stores_status:
 *                     type: string
 *                     description: Status of the order in the stores department
 *                     example: "ready_for_dispatch"
 *       '500':
 *         description: Internal Server Error - Failed to retrieve orders
 */

route.get(
  "/get-all-orders",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(StatusCodes.OK).send(await getAllOrders());
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /planning/add-deadline:
 *   patch:
 *     summary: Add a deadline and details to an order
 *     tags:
 *       - Planning
 *     description: Adds a deadline to an order along with additional details like payment terms, SAP reference number, and product specifications.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 format: uuid
 *                 description: The unique identifier of the order
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               payment_terms:
 *                 type: string
 *                 format: uuid
 *                 description: The UUID of the payment terms
 *                 example: "2abfc2e9-3ae6-4e59-8dcd-4ff397dae474"
 *               sap_reference_number:
 *                 type: string
 *                 description: SAP reference number for the order
 *                 example: "SAP123456"
 *               uom:
 *                 type: string
 *                 description: Unit of measure
 *                 example: "order management"
 *               motorType:
 *                 type: string
 *                 description: Type of motor
 *                 example: "AC"
 *               headSize:
 *                 type: string
 *                 description: Head size of the motor
 *                 example: "100"
 *               current:
 *                 type: string
 *                 description: Current specification
 *                 example: "100A"
 *               diameter:
 *                 type: string
 *                 description: Diameter of the motor
 *                 example: "10cm"
 *               pannel_type:
 *                 type: string
 *                 description: Type of panel
 *                 example: "Solar"
 *               spd:
 *                 type: boolean
 *                 description: Indicates if SPD (Surge Protection Device) is included
 *                 example: true
 *               data:
 *                 type: boolean
 *                 description: Indicates if additional data is included
 *                 example: true
 *               warranty:
 *                 type: boolean
 *                 description: Indicates if warranty is provided
 *                 example: true
 *               transportation:
 *                 type: boolean
 *                 description: Indicates if transportation is included
 *                 example: true
 *               price:
 *                 type: number
 *                 description: Price of the line item
 *                 example: 1500
 *               quantity:
 *                 type: number
 *                 description: Quantity of the line item
 *                 example: 10
 *               deadline:
 *                 type: string
 *                 format: date
 *                 description: Deadline for the order
 *                 example: "2024-12-31"
 *             required:
 *               - orderId
 *               - payment_terms
 *               - sap_reference_number
 *               - uom
 *               - motorType
 *               - headSize
 *               - current
 *               - diameter
 *               - pannel_type
 *               - spd
 *               - data
 *               - warranty
 *               - transportation
 *               - price
 *               - quantity
 *               - deadline
 *     responses:
 *       '200':
 *         description: Successfully added the deadline and updated the order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "successfully deadline added to the order"
 *       '400':
 *         description: Bad Request - Invalid or missing input data
 *       '404':
 *         description: Not Found - Order ID does not exist or is inactive
 *       '500':
 *         description: Internal Server Error - Failed to update the order
 */

route.patch(
  "/add-deadline",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      res
        .status(StatusCodes.OK)
        .send(await addDeadLineToOrdersByPlanning(data));
    } catch (error) {
      next(error);
    }
  }
);
/**
 * @swagger
 * /planning/get-planning-orders/{id}:
 *   get:
 *     summary: Get planning orders by ID
 *     tags:
 *       - Planning
 *     description: Fetches details of a specific order by ID, including associated line items.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the order
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       '200':
 *         description: Successfully retrieved the order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the order
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 customerId:
 *                   type: string
 *                   description: The unique identifier of the customer
 *                   example: "abc12345-e89b-12d3-a456-426614174001"
 *                 productId:
 *                   type: string
 *                   description: The unique identifier of the product
 *                   example: "def12345-e89b-12d3-a456-426614174002"
 *                 quantity:
 *                   type: number
 *                   description: Total quantity in the order
 *                   example: 100
 *                 price:
 *                   type: number
 *                   description: Total price of the order
 *                   example: 5000.00
 *                 lineItems:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The unique identifier of the line item
 *                         example: "456e7890-a123-45c6-b789-5678e901f234"
 *                       uom:
 *                         type: string
 *                         description: Unit of measure for the line item
 *                         example: "order management"
 *                       price:
 *                         type: number
 *                         description: Price of the line item
 *                         example: 1500
 *                       headSize:
 *                         type: string
 *                         description: Head size of the motor
 *                         example: "100"
 *                       motorType:
 *                         type: string
 *                         description: Type of motor
 *                         example: "AC"
 *                       current:
 *                         type: string
 *                         description: Current specification
 *                         example: "100A"
 *                       diameter:
 *                         type: string
 *                         description: Diameter of the motor
 *                         example: "10cm"
 *                       pannel_type:
 *                         type: string
 *                         description: Type of panel
 *                         example: "Solar"
 *                       spd:
 *                         type: boolean
 *                         description: Indicates if SPD (Surge Protection Device) is included
 *                         example: true
 *                       data:
 *                         type: boolean
 *                         description: Indicates if additional data is included
 *                         example: true
 *                       warranty:
 *                         type: boolean
 *                         description: Indicates if warranty is provided
 *                         example: true
 *                       transportation:
 *                         type: boolean
 *                         description: Indicates if transportation is included
 *                         example: true
 *                       deadLine:
 *                         type: string
 *                         format: date
 *                         description: Deadline for the line item
 *                         example: "2024-12-31"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp when the line item was created
 *                         example: "2024-01-01T12:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp when the line item was last updated
 *                         example: "2024-01-02T15:30:00Z"
 *       '400':
 *         description: Bad Request - Invalid or missing order ID
 *       '404':
 *         description: Not Found - Order ID does not exist
 *       '500':
 *         description: Internal Server Error - Failed to retrieve the order
 */

route.get(
  "/get-planning-orders/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      res.status(StatusCodes.OK).send(await getPlanningOrdersById(id));
    } catch (error) {
      next(error);
    }
  }
);
export default route;
