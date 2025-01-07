import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import {
  addLineItems,
  addSapReferenceNumberSales,
  getAllCustmerAcceptedOrdersSales,
  getAllStoresExecutiveOrders,
  getCustomersRejectedOrders,
  getOrdersByDays,
  getSalesExecutiveOrders,
  getStoreExecutiveOrderById,
  scannedProducts,
  searchStoresExecutiveOrders,
  updateOrderDetails,
} from "./module";
import {
  ensureSalesExecutive,
  ensureStoresExecutive,
} from "../utils/authentication";
const route = Router();

/**
 * @swagger
 * /get-sales-executive-orders:
 *   get:
 *     summary: Get orders for a sales executive
 *     tags:
 *       - Sales-Executive
 *     description: Retrieve all active orders assigned to a sales executive. Filters are available by date range or relative time (e.g., today, week, month).
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date of the date range (in YYYY-MM-DD format)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date of the date range (in YYYY-MM-DD format)
 *       - in: query
 *         name: time
 *         schema:
 *           type: string
 *           enum: [today, week, month]
 *         required: false
 *         description: Relative time filter (e.g., orders from today, this week, or this month)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination (default is 1)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of records per page (default is 10)
 *     responses:
 *       '200':
 *         description: A successful response containing order details for the sales executive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The sales executive's order relation ID
 *                         example: "12345"
 *                       orders:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The order ID
 *                             example: "54321"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: The creation timestamp of the order
 *                             example: "2024-01-01T12:00:00Z"
 *                           isActive:
 *                             type: boolean
 *                             description: Whether the order is active
 *                             example: true
 *       '400':
 *         description: Bad Request - Invalid or missing parameters
 *       '500':
 *         description: Internal Server Error
 */

route.get(
  "/get-sales-executive-orders",
  ensureSalesExecutive,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { salesExcecutiveId: id } = (req as any).user;
      console.log(id);
      const { from, to, time, searchById, page = 1, pageSize = 10 } = req.query;
      res
        .status(StatusCodes.OK)
        .send(
          await getSalesExecutiveOrders(
            id as string,
            from as any,
            to as any,
            time as any,
            page as number,
            pageSize as number
          )
        );
    } catch (error) {
      next(error);
    }
  }
);
/**
 * @swagger
 * /update-order-details:
 *   patch:
 *     summary: Update order details
 *     tags:
 *       - Sales-Executive
 *     description: Updates the details of an order, including its attributes like payment terms, head size, motor type, and other optional properties. Marks the order as approved by sales and sets the sales negotiation status.
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
 *                 description: The unique identifier of the order to update
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               payment_terms:
 *                 type: string
 *                 format: uuid
 *                 description: Payment terms identifier
 *                 example: "123e4567-e89b-12d3-a456-426614174001"
 *               sap_reference_number:
 *                 type: string
 *                 description: SAP reference number for the order
 *                 example: "SAP123456"
 *             required:
 *               - orderId
 *               - payment_terms
 *               - sap_reference_number
 *     responses:
 *       '200':
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "order updated successfully"
 *       '400':
 *         description: Bad Request - Validation errors or missing fields
 *       '404':
 *         description: Not Found - The order with the specified ID does not exist
 *       '500':
 *         description: Internal Server Error - Failed to update the order
 */

route.patch(
  "/update-order-details",
  ensureSalesExecutive,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const info = (req as any).body;
      res.status(StatusCodes.OK).send(await updateOrderDetails(info));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /executive/sort-orders-by-days:
 *   get:
 *     summary: Get orders filtered by date or ID
 *     tags:
 *       - Sales-Executive
 *     description: Retrieves orders filtered by a specified date range, time period (today, week, or month), or by order ID.
 *     parameters:
 *       - in: query
 *         name: options
 *         schema:
 *           type: string
 *           enum: [today, week, month]
 *         required: false
 *         description: Filter orders by a specific time period (`today`, `week`, or `month`).
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: Start date of the date range (e.g., 2024-12-01T00:00:00.000Z).
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: End date of the date range (e.g., 2024-12-31T23:59:59.000Z).
 *       - in: query
 *         name: searchById
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter orders by a partial match on the order ID.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication.
 *     responses:
 *       '200':
 *         description: Successfully fetched orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: List of orders matching the specified criteria
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Sales-Executive-Order relation ID
 *                     example: "rel12345"
 *                   salesExecutivesId:
 *                     type: string
 *                     description: ID of the sales executive
 *                     example: "exec12345"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the order relation was created
 *                     example: "2024-12-20T10:00:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the order relation was last updated
 *                     example: "2024-12-20T12:00:00.000Z"
 *                   orders:
 *                     type: object
 *                     description: Details of the associated order
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Order ID
 *                         example: "order12345"
 *                       shipping_Address:
 *                         type: string
 *                         description: Shipping address of the order
 *                         example: "123 Street Name, Industrial Area"
 *                       billing_Address:
 *                         type: string
 *                         description: Billing address of the order
 *                         example: "456 Avenue Road, Business District"
 *       '400':
 *         description: Bad Request - Invalid query parameters
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

route.get(
  "/sort-orders-by-days",
  ensureSalesExecutive,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { options, from, to, searchById } = req.query;
      res
        .status(StatusCodes.OK)
        .send(
          await getOrdersByDays(
            options as any,
            from as any,
            to as any,
            searchById as any
          )
        );
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /executive/get-all-stores-executive-orders:
 *   get:
 *     summary: Get all active orders assigned to a store executive
 *     tags:
 *       - Stores-Executives
 *     description: Retrieves all orders assigned to a specific store executive that are active and under process.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication.
 *     responses:
 *       '200':
 *         description: Successfully fetched orders assigned to the store executive.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: List of orders assigned to the store executive.
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Store-Executive-Order relation ID.
 *                     example: "rel12345"
 *                   storesExecutivesId:
 *                     type: string
 *                     description: ID of the store executive.
 *                     example: "exec56789"
 *                   isActive:
 *                     type: boolean
 *                     description: Indicates whether the relation is active.
 *                     example: true
 *                   isUnderProcess:
 *                     type: boolean
 *                     description: Indicates whether the order is under process.
 *                     example: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp of when the relation was created.
 *                     example: "2024-12-20T10:00:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp of when the relation was last updated.
 *                     example: "2024-12-20T12:00:00.000Z"
 *                   orders:
 *                     type: object
 *                     description: Details of the associated order.
 *                     properties:
 *                       deadLine:
 *                         type: string
 *                         format: date-time
 *                         description: Deadline for the order.
 *                         example: "2024-12-31T23:59:59.000Z"
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

route.get(
  "/get-all-stores-executive-orders",
  ensureStoresExecutive,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { executiveId } = (req as any).user;
      res
        .status(StatusCodes.OK)
        .send(await getAllStoresExecutiveOrders(executiveId));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /executive/get-stores-executive-order/{orderId}:
 *   get:
 *     summary: Get order details by order ID for a store executive
 *     tags:
 *       - Stores-Executives
 *     description: Retrieves detailed information about a specific order assigned to a store executive using the order ID.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to retrieve.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication.
 *     responses:
 *       '200':
 *         description: Successfully fetched order details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Details of the order and its association with the store executive.
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Store-Executive-Order relation ID.
 *                   example: "rel12345"
 *                 orderId:
 *                   type: string
 *                   description: ID of the associated order.
 *                   example: "order12345"
 *                 storesExecutivesId:
 *                   type: string
 *                   description: ID of the store executive.
 *                   example: "exec56789"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of when the relation was created.
 *                   example: "2024-12-20T10:00:00.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of when the relation was last updated.
 *                   example: "2024-12-20T12:00:00.000Z"
 *                 orders:
 *                   type: object
 *                   description: Details of the associated order.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Order ID.
 *                       example: "order12345"
 *                     shipping_Address:
 *                       type: string
 *                       description: Shipping address of the order.
 *                       example: "123 Street Name, Industrial Area"
 *                     billing_Address:
 *                       type: string
 *                       description: Billing address of the order.
 *                       example: "456 Avenue Road, Business District"
 *       '404':
 *         description: Order not found - Invalid order ID.
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

route.get(
  "/get-stores-executive-order/:orderId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res
        .status(StatusCodes.OK)
        .send(await getStoreExecutiveOrderById(req.params.orderId));
    } catch (error) {
      next(error);
    }
  }
);
/**
 * @swagger
 * /executive/search-stores-executive-orders:
 *   get:
 *     summary: Search orders assigned to a store executive
 *     tags:
 *       - Stores-Executives
 *     description: Retrieves orders assigned to a store executive filtered by a specified time period, date range, or order ID.
 *     parameters:
 *       - in: query
 *         name: options
 *         schema:
 *           type: string
 *           enum: [today, week, month]
 *         required: false
 *         description: Filter orders by a specific time period (`today`, `week`, or `month`).
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: Start date of the date range (e.g., 2024-12-01T00:00:00.000Z).
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: End date of the date range (e.g., 2024-12-31T23:59:59.000Z).
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter orders by a partial match on the order ID.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication.
 *     responses:
 *       '200':
 *         description: Successfully fetched orders matching the criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: List of orders matching the specified criteria.
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Store-Executive-Order relation ID.
 *                     example: "rel12345"
 *                   storesExecutivesId:
 *                     type: string
 *                     description: ID of the store executive.
 *                     example: "exec56789"
 *                   isActive:
 *                     type: boolean
 *                     description: Indicates whether the relation is active.
 *                     example: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp of when the relation was created.
 *                     example: "2024-12-20T10:00:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp of when the relation was last updated.
 *                     example: "2024-12-20T12:00:00.000Z"
 *                   orders:
 *                     type: object
 *                     description: Details of the associated order.
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Order ID.
 *                         example: "order12345"
 *                       shipping_Address:
 *                         type: string
 *                         description: Shipping address of the order.
 *                         example: "123 Street Name, Industrial Area"
 *                       billing_Address:
 *                         type: string
 *                         description: Billing address of the order.
 *                         example: "456 Avenue Road, Business District"
 *       '400':
 *         description: Bad Request - Invalid query parameters.
 *       '401':
 *         description: Unauthorized.
 *       '500':
 *         description: Internal Server Error.
 */

route.get(
  "/search-stores-executive-orders",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { options, from, to, orderId } = req.query;
      res
        .status(StatusCodes.OK)
        .send(
          await searchStoresExecutiveOrders(
            options as string,
            from as string,
            to as string,
            orderId as string
          )
        );
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /executive/scan-product:
 *   post:
 *     summary: Scan a product at different stages of processing
 *     tags:
 *       - utils
 *     description: Allows different roles (e.g., Stores Executive, Winding Executive, Assembly Executive, etc.) to scan products during various stages of processing.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product being scanned.
 *                 example: "prod12345"
 *               unitUniqueId:
 *                 type: string
 *                 description: Unique ID of the unit scanning the product.
 *                 example: "unit56789"
 *               current:
 *                 type: number
 *                 description: Current value (if applicable).
 *                 example: 10.5
 *               motorHp:
 *                 type: number
 *                 description: Motor horsepower (if applicable).
 *                 example: 15
 *               headSize:
 *                 type: number
 *                 description: Head size (if applicable).
 *                 example: 25
 *               productName:
 *                 type: string
 *                 description: Name of the product.
 *                 example: "Solar Pump"
 *               totalScanned:
 *                 type: number
 *                 description: The total number of scanned products.
 *                 example: 5
 *               netQuantity:
 *                 type: number
 *                 description: The total required quantity of the product.
 *                 example: 10
 *     responses:
 *       '200':
 *         description: Successfully scanned the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Product scanned successfully by Stores team"
 *       '400':
 *         description: Bad Request - Invalid input data or product scanning limit reached
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Internal Server Error
 */

route.post(
  "/scan-product",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userRole } = (req as any).user;
      const data = req.body;
      res.status(StatusCodes.OK).send(await scannedProducts(userRole, data));
    } catch (error) {
      next(error);
    }
  }
);
/**
 * @swagger
 * /get-customers-rejected-orders:
 *   get:
 *     summary: Get customers' rejected orders
 *     tags:
 *       - Sales-Executive
 *     description: Retrieves all rejected orders associated with the sales executive.
 *     responses:
 *       '200':
 *         description: Successfully fetched rejected orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "successfully fetched rejected orders"
 *                 salesExeOrders:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the sales executive order relation
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     orders:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The order ID
 *                             example: "12345"
 *                           sales_negotiation_status:
 *                             type: string
 *                             description: The negotiation status of the order
 *                             example: "rejected"
 *                           quantity:
 *                             type: number
 *                             description: Quantity of items in the order
 *                             example: 10
 *                           price:
 *                             type: number
 *                             description: Total price of the order
 *                             example: 1500
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: The creation timestamp of the order
 *                             example: "2024-01-01T12:00:00Z"
 *       '400':
 *         description: Bad Request - Invalid or missing parameters
 *       '404':
 *         description: Not Found - No orders found for the sales executive
 *       '500':
 *         description: Internal Server Error - Failed to fetch orders
 */

route.get(
  "/get-customers-rejected-orders",
  ensureSalesExecutive,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { salesExcecutiveId } = (req as any).user;
      res
        .status(StatusCodes.OK)
        .send(await getCustomersRejectedOrders(salesExcecutiveId));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /add-line-items:
 *   post:
 *     summary: Add line items to an order
 *     tags:
 *       - Sales-Executive
 *     description: Adds multiple line items to an order, calculates the total price and quantity, and updates the order details including SAP reference number and payment terms.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 orderId:
 *                   type: string
 *                   format: uuid
 *                   description: The unique identifier of the order to which the line items belong
 *                   example: "fe6d0842-c6b3-4304-969c-277c3b8e8c6d"
 *                 uom:
 *                   type: string
 *                   description: Unit of measure for the item
 *                   example: "order management"
 *                 motor_type:
 *                   type: string
 *                   description: Type of motor
 *                   example: "AC"
 *                 headSize:
 *                   type: string
 *                   description: Head size of the motor
 *                   example: "100"
 *                 current:
 *                   type: string
 *                   description: Current specification
 *                   example: "100v"
 *                 diameter:
 *                   type: string
 *                   description: Diameter of the item
 *                   example: "100m"
 *                 pannel_type:
 *                   type: string
 *                   description: Panel type
 *                   example: "long"
 *                 spd:
 *                   type: boolean
 *                   description: Indicates if SPD (Surge Protection Device) is included
 *                   example: true
 *                 data:
 *                   type: boolean
 *                   description: Indicates if additional data is included
 *                   example: true
 *                 warranty:
 *                   type: boolean
 *                   description: Indicates if warranty is provided
 *                   example: true
 *                 transportation:
 *                   type: boolean
 *                   description: Indicates if transportation is included
 *                   example: true
 *                 price:
 *                   type: string
 *                   description: Price of the line item
 *                   example: "90000"
 *                 quantity:
 *                   type: string
 *                   description: Quantity of the line item
 *                   example: "100"
 *                 deadline:
 *                   type: string
 *                   format: date
 *                   description: Deadline for the order
 *                   example: "2024-10-12"
 *                 payment_terms:
 *                   type: string
 *                   format: uuid
 *                   description: Payment terms identifier
 *                   example: "2abfc2e9-3ae6-4e59-8dcd-4ff397dae474"
 *                 sap_reference_number:
 *                   type: string
 *                   description: SAP reference number for the order
 *                   example: "1231231234"
 *                 advanceAmount:
 *                   type: number
 *                   description: Advance amount for the order
 *                   example: 10000
 *     responses:
 *       '201':
 *         description: Line items successfully created and order updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "successfully created line items"
 *       '400':
 *         description: Bad Request - Invalid or missing input data
 *       '404':
 *         description: Not Found - Order ID does not exist
 *       '500':
 *         description: Internal Server Error - Failed to add line items
 */

route.post(
  "/add-line-items",
  ensureSalesExecutive,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      res.status(StatusCodes.CREATED).send(await addLineItems(data));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /get-customer-accepted-orders:
 *   get:
 *     summary: Retrieve all customer-accepted orders for a Sales Executive
 *     tags:
 *       - Sales-Executive
 *     description: Retrieves a list of all active orders accepted by customers for the authenticated Sales Executive. The orders returned have either no SAP reference number or an empty one, and are approved by both planning and accounts departments.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved customer-accepted orders
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
 *                     example: "fe6d0842-c6b3-4304-969c-277c3b8e8c6d"
 *                   customerId:
 *                     type: string
 *                     format: uuid
 *                     example: "c1a4d2e5-3b6f-4e8d-9f12-3456abcdef78"
 *                   productId:
 *                     type: string
 *                     format: uuid
 *                     example: "d2b4e3f6-4c7g-5h9i-0j1k-4567ghijklmn"
 *                   quantity:
 *                     type: number
 *                     example: 100
 *                   shipping_Address:
 *                     type: string
 *                     example: "123 Main St, Cityville"
 *                   billing_Address:
 *                     type: string
 *                     example: "456 Side St, Townsville"
 *                   reason:
 *                     type: string
 *                     example: "Standard order"
 *                   discount:
 *                     type: number
 *                     example: 10.5
 *                   remarks:
 *                     type: string
 *                     example: "Urgent delivery required"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-04-25T10:20:30Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-04-26T11:25:35Z"
 *                   deadLine:
 *                     type: string
 *                     format: date
 *                     example: "2024-10-12"
 *                   advanceAmount:
 *                     type: number
 *                     example: 5000
 *                   payment_terms:
 *                     type: string
 *                     format: uuid
 *                     example: "2abfc2e9-3ae6-4e59-8dcd-4ff397dae474"
 *                   approved_by_sales:
 *                     type: boolean
 *                     example: true
 *                   approved_by_accounts:
 *                     type: boolean
 *                     example: true
 *                   approved_by_planning:
 *                     type: boolean
 *                     example: true
 *                   approved_by_customer:
 *                     type: boolean
 *                     example: true
 *                   approved_by_stores:
 *                     type: boolean
 *                     example: true
 *                   order_status:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Pending", "Confirmed"]
 *                   product_status:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["In Production", "Dispatched"]
 *                   isActive:
 *                     type: boolean
 *                     example: true
 *                   price:
 *                     type: number
 *                     example: 900000
 *                   data:
 *                     type: string
 *                     example: "Additional data info"
 *                   diameter:
 *                     type: string
 *                     example: "100m"
 *                   current:
 *                     type: string
 *                     example: "100v"
 *                   headSize:
 *                     type: number
 *                     example: 100
 *                   motorType:
 *                     type: string
 *                     example: "AC"
 *                   pannelType:
 *                     type: string
 *                     example: "Long"
 *                   spd:
 *                     type: string
 *                     example: "Yes"
 *                   transportation:
 *                     type: string
 *                     example: "Included"
 *                   warranty:
 *                     type: string
 *                     example: "2 years"
 *                   sap_reference_number:
 *                     type: string
 *                     example: ""
 *                   lineItems:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/LineItem'
 *       '400':
 *         description: Bad Request - Invalid request parameters or authentication
 *       '401':
 *         description: Unauthorized - Authentication failed or missing
 *       '404':
 *         description: Not Found - No orders found for the Sales Executive
 *       '500':
 *         description: Internal Server Error - Failed to retrieve orders
 */

route.get(
  "/get-customer-accepted-orders",
  ensureSalesExecutive,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { salesExcecutiveId } = (req as any).user;
      res
        .status(StatusCodes.OK)
        .send(await getAllCustmerAcceptedOrdersSales(salesExcecutiveId));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /add-sap-refernece-number:
 *   patch:
 *     summary: Add SAP reference number to an order
 *     tags:
 *       - Sales-Executive
 *     description: Adds a SAP reference number to an existing order. The order must be approved by sales and should not already have a SAP reference number. Additionally, the order must be active and not closed by the sales team.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - sap_reference_number
 *             properties:
 *               orderId:
 *                 type: string
 *                 format: uuid
 *                 description: The unique identifier of the order to update
 *                 example: "fe6d0842-c6b3-4304-969c-277c3b8e8c6d"
 *               sap_reference_number:
 *                 type: string
 *                 description: The SAP reference number to add to the order
 *                 example: "SAP20250107001"
 *     responses:
 *       '200':
 *         description: SAP reference number successfully added to the order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "successfully sap number added"
 *       '400':
 *         description: Bad Request - Invalid input data or order not eligible for SAP reference number addition
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized - Authentication failed or missing
 *       '404':
 *         description: Not Found - Order not found or already has a SAP reference number
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error - Failed to add SAP reference number
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

route.patch(
  "/add-sap-refernece-number",
  ensureSalesExecutive,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, sap_reference_number } = req.body;
      res
        .status(StatusCodes.OK)
        .send(
          await addSapReferenceNumberSales(
            orderId as any,
            sap_reference_number as any
          )
        );
    } catch (error) {
      next(error);
    }
  }
);
export default route;

//
