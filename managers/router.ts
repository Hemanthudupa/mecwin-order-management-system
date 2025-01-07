import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import {
  ensureSalesManager,
  ensureStoresManager,
} from "../utils/authentication";
import {
  assignSalesExecutive,
  assignStoresExecutiveOrder,
  getAllOrdersStores,
  getAllSalesExecutives,
  getAllStoresExecutives,
  getOrdersSales,
  getSalesCompleteDetails,
  getSalesPendingDetails,
  getSalesUnderProcessingDetails,
  getStoresOrderById,
  searchInfo,
} from "./module";
const route = Router();

/**
 * @swagger
 * /get-orders-sales:
 *   get:
 *     summary: Get orders for a sales manager
 *     tags:
 *       - Sales-Manager
 *     description: Retrieve all active orders for a sales manager within their designated work locations. Results are paginated.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: The page number for pagination (default is 1)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: The number of records per page (default is 10)
 *     responses:
 *       '200':
 *         description: A successful response containing order details
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
 *                         description: The order ID
 *                         example: "12345"
 *                       shipping_Address:
 *                         type: string
 *                         description: The shipping address for the order
 *                         example: "123 Main St, City, State"
 *                       customers:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The customer or distributor ID
 *                             example: "67890"
 *                           shipping_Address_state:
 *                             type: string
 *                             description: The state of the customer's shipping address
 *                             example: "California"
 *                       products:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               description: The product ID
 *                               example: "P123"
 *                             name:
 *                               type: string
 *                               description: The product name
 *                               example: "Widget 3000"
 *       '400':
 *         description: Bad Request - Invalid or missing parameters
 *       '500':
 *         description: Internal Server Error
 */

route.get(
  "/get-orders-sales",
  ensureSalesManager,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { managerId, id } = (req as any).user;
      const { page = 1, pageSize = 10 } = req.query;

      res
        .status(StatusCodes.OK)
        .send(
          await getOrdersSales(
            managerId,
            id,
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
 * /manager/get-all-sales-executives:
 *   get:
 *     summary: Get all sales executives for a manager
 *     tags:
 *       - Sales-Manager
 *     description: Retrieves all sales executives under a specific sales manager.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *       - in: query
 *         name: managerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the sales manager
 *     responses:
 *       '200':
 *         description: Successful response containing sales executives
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Sales executive's unique ID
 *                     example: "f4c86b38-7ea4-4d0f-8d31-f20e59fd11b6"
 *                   employeeId:
 *                     type: string
 *                     description: Employee ID of the sales executive
 *                     example: "0110"
 *                   userId:
 *                     type: string
 *                     description: User ID associated with the sales executive
 *                     example: "0cb8bf64-c839-4d91-97f2-1fd3a7c3cb21"
 *                   location:
 *                     type: string
 *                     description: Location of the sales executive
 *                     example: "karnataka"
 *                   managerId:
 *                     type: string
 *                     description: Manager ID associated with the sales executive
 *                     example: "8d3ee4dd-8b4c-4c01-8b69-979cdef5d2e9"
 *                   userName:
 *                     type: string
 *                     description: Username of the sales executive
 *                     example: "shivani"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp of record creation
 *                     example: "2024-12-11T07:26:54.188Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp of record update
 *                     example: "2024-12-11T07:26:54.188Z"
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: User's unique ID
 *                         example: "0cb8bf64-c839-4d91-97f2-1fd3a7c3cb21"
 *                       userName:
 *                         type: string
 *                         description: Username of the user
 *                         example: "shivani"
 *                       phoneNumber:
 *                         type: string
 *                         description: Phone number of the user
 *                         example: "shivani"
 *                       email:
 *                         type: string
 *                         description: Email address of the user
 *                         example: "shivani1@gmail.com"
 *                       password:
 *                         type: string
 *                         description: Hashed password of the user
 *                         example: "$2b$11$vNb3KmpX3gCKQbDRBqRKfekzkMaMnr4bEkSm30t1xGO4AWk5qIv5."
 *                       userRole:
 *                         type: string
 *                         description: Role ID of the user
 *                         example: "87378b35-9255-4506-84b3-6061eea0e2bd"
 *                       isActive:
 *                         type: boolean
 *                         description: Whether the user is active
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of user record creation
 *                         example: "2024-12-11T07:26:54.187Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of user record update
 *                         example: "2024-12-11T07:26:54.187Z"
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

route.get(
  "/get-all-sales-executives",
  ensureSalesManager,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { managerId } = (req as any).user;
      res.status(StatusCodes.OK).send(await getAllSalesExecutives(managerId));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /manager/assign-sales-executive:
 *   post:
 *     summary: Assign a sales executive to an order
 *     tags:
 *       - Sales-Manager
 *     description: Assigns a sales executive to a specific order.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               salesExecutiveId:
 *                 type: string
 *                 description: The ID of the sales executive to assign
 *                 example: "12345"
 *               orderId:
 *                 type: string
 *                 description: The ID of the order to assign to
 *                 example: "67890"
 *     responses:
 *       '201':
 *         description: Sales executive successfully assigned to the order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Successfully sales executive assigned to an order"
 *                 salesExe_order:
 *                   type: object
 *                   properties:
 *                     salesExecutivesId:
 *                       type: string
 *                       description: Assigned sales executive ID
 *                       example: "12345"
 *                     orderId:
 *                       type: string
 *                       description: Assigned order ID
 *                       example: "67890"
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Invalid order ID"
 *       '500':
 *         description: Internal Server Error
 */

route.post(
  "/assign-sales-executive",
  ensureSalesManager,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { salesExecutiveId, orderId } = req.body;
      res
        .status(StatusCodes.CREATED)
        .send(await assignSalesExecutive(salesExecutiveId, orderId));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /manager/sales-complete:
 *   get:
 *     summary: Get completed sales details
 *     tags:
 *       - Sales-Manager
 *     description: Retrieves details of completed sales. Optionally, fetches only the count of completed sales.
 *     parameters:
 *       - in: query
 *         name: options
 *         schema:
 *           type: string
 *           example: "count"
 *         required: false
 *         description: If provided, returns only the count of completed sales.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       '200':
 *         description: Successfully fetched sales details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Successfully fetched count details completed sales"
 *                 count:
 *                   type: integer
 *                   description: Count of completed sales (if `options` is provided)
 *                   example: 42
 *                 data:
 *                   type: array
 *                   description: Array of completed sales details (if `options` is not provided)
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Order ID
 *                         example: "f4c86b38-7ea4-4d0f-8d31-f20e59fd11b6"
 *                       approved_by_sales:
 *                         type: boolean
 *                         description: Indicates if the order was approved by sales
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of order creation
 *                         example: "2024-12-11T07:26:54.188Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of order update
 *                         example: "2024-12-11T07:26:54.188Z"
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

route.get(
  "/sales-complete",
  ensureSalesManager,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { options } = req.query;
      res
        .status(StatusCodes.OK)
        .send(await getSalesCompleteDetails(options as string));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /manager/sales-pending:
 *   get:
 *     summary: Get pending sales details
 *     tags:
 *       - Sales-Manager
 *     description: Retrieves details of pending sales. Optionally, fetches only the count of pending sales.
 *     parameters:
 *       - in: query
 *         name: options
 *         schema:
 *           type: string
 *           example: "count"
 *         required: false
 *         description: If provided, returns only the count of pending sales.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       '200':
 *         description: Successfully fetched pending sales details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Successfully fetched count details of pending sales"
 *                 count:
 *                   type: integer
 *                   description: Count of pending sales (if `options` is provided)
 *                   example: 42
 *                 data:
 *                   type: array
 *                   description: Array of pending sales details (if `options` is not provided)
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Order ID
 *                         example: "9399bf04-0974-47bb-b2b4-baeef401f54b"
 *                       quantity:
 *                         type: integer
 *                         description: Quantity of items in the order
 *                         example: 10
 *                       customerId:
 *                         type: string
 *                         description: Customer ID associated with the order
 *                         example: "90483832-e858-43f4-9b04-a9c6736987f4"
 *                       productId:
 *                         type: string
 *                         description: Product ID associated with the order
 *                         example: "81939444-ccc0-47cb-865a-2b7ce4b24aef"
 *                       shipping_Address:
 *                         type: string
 *                         description: Shipping address for the order
 *                         example: "123 Street Name, Industrial Area"
 *                       billing_Address:
 *                         type: string
 *                         description: Billing address for the order
 *                         example: "456 Avenue Road, Business District"
 *                       sales_negotiation_status:
 *                         type: string
 *                         description: Sales negotiation status of the order
 *                         example: "ASSIGNED"
 *                       stores_status:
 *                         type: string
 *                         description: Stores status of the order
 *                         example: "TO BE PROCESSED"
 *                       approved_by_sales:
 *                         type: boolean
 *                         description: Whether the order is approved by sales
 *                         example: false
 *                       isActive:
 *                         type: boolean
 *                         description: Whether the order is active
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of order creation
 *                         example: "2024-12-13T07:07:55.923Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of order update
 *                         example: "2024-12-13T07:07:55.923Z"
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

route.get(
  "/sales-pending",
  ensureSalesManager,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { options } = req.query;
      res
        .status(StatusCodes.OK)
        .send(await getSalesPendingDetails(options as string));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /manager/sales-underprocessing:
 *   get:
 *     summary: Get sales under processing details
 *     tags:
 *       - Sales-Manager
 *     description: Retrieves details of sales under processing. Optionally, fetches only the count of sales under processing.
 *     parameters:
 *       - in: query
 *         name: options
 *         schema:
 *           type: string
 *           example: "count"
 *         required: false
 *         description: If provided, returns only the count of sales under processing.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       '200':
 *         description: Successfully fetched sales under processing details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Successfully fetched count details of pending sales"
 *                 count:
 *                   type: integer
 *                   description: Count of sales under processing (if `options` is provided)
 *                   example: 15
 *                 data:
 *                   type: array
 *                   description: Array of sales under processing details (if `options` is not provided)
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Order relation ID
 *                         example: "abc12345-6789-0abc-def0-123456789abc"
 *                       salesExecutivesId:
 *                         type: string
 *                         description: Sales executive ID associated with the order
 *                         example: "1234abcd-5678-efgh-ijkl-567890mnopqr"
 *                       orderId:
 *                         type: string
 *                         description: Order ID associated with the processing sales
 *                         example: "abcd1234-5678-90ef-ghij-123456789klm"
 *                       isUnderProcess:
 *                         type: boolean
 *                         description: Indicates if the sales is under processing
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of record creation
 *                         example: "2024-12-16T11:59:50.331Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of record update
 *                         example: "2024-12-16T12:01:19.187Z"
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

route.get(
  "/sales-underprocessing",
  ensureSalesManager,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { options } = req.query;
      res
        .status(StatusCodes.OK)
        .send(await getSalesUnderProcessingDetails(options as string));
    } catch (error) {
      next(error);
    }
  }
);
/**
 * @swagger
 * /manager/search-info:
 *   get:
 *     summary: Search information
 *     tags:
 *       - Sales-Manager
 *     description: Searches for orders, customers, or employees based on various criteria like `orderId`, `customerId`, or `employeeId`. If no options are provided, returns all orders in the manager's work locations.
 *     parameters:
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: string
 *         required: false
 *         description: Search for orders based on their ID.
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *         required: false
 *         description: Search for customers based on their ID.
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *         required: false
 *         description: Search for employees based on their employee ID.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               options:
 *                 type: object
 *                 description: Search options containing `orderId`, `customerId`, or `employeeId`.
 *                 example: { "orderId": "abc123" }
 *     responses:
 *       '200':
 *         description: Successful response containing the search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: List of search results based on the criteria
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique identifier
 *                     example: "12345"
 *                   shipping_Address:
 *                     type: string
 *                     description: Shipping address
 *                     example: "123 Street Name, Industrial Area"
 *                   billing_Address:
 *                     type: string
 *                     description: Billing address
 *                     example: "456 Avenue Road, Business District"
 *                   isActive:
 *                     type: boolean
 *                     description: Whether the record is active
 *                     example: true
 *       '400':
 *         description: Bad Request - Invalid search options
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

route.get(
  "/search-info",
  ensureSalesManager,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const options = (req as any).body;
      res
        .status(StatusCodes.OK)
        .send(await searchInfo(options, (req as any).user));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /manager/get-orders-stores:
 *   get:
 *     summary: Get all pending orders for stores
 *     tags:
 *       - Stores-Manager
 *     description: Retrieves all orders that have been approved by sales but are pending approval by stores.
 *     responses:
 *       '200':
 *         description: Successfully fetched pending orders for stores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   type: array
 *                   description: List of orders pending store approval
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Order ID
 *                         example: "12345"
 *                       customerId:
 *                         type: string
 *                         description: ID of the customer who placed the order
 *                         example: "abc12345"
 *                       deadLine:
 *                         type: string
 *                         format: date-time
 *                         description: Deadline for processing the order
 *                         example: "2024-12-20T15:30:00.000Z"
 *                       quantity:
 *                         type: integer
 *                         description: Quantity of products in the order
 *                         example: 10
 *                       stores_status:
 *                         type: string
 *                         description: Current status of the order in stores
 *                         example: "TO BE PROCESSED"
 *                       products:
 *                         type: object
 *                         description: Details of the product in the order
 *                         properties:
 *                           product_name:
 *                             type: string
 *                             description: Name of the product
 *                             example: "Solar Pump"
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

route.get(
  "/get-orders-stores",
  ensureStoresManager,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(StatusCodes.OK).send(await getAllOrdersStores());
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /manager/get-all-stores-executives:
 *   get:
 *     summary: Get all store executives under a manager
 *     tags:
 *       - Stores-Manager
 *     description: Retrieves all store executives who report to a specific manager.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       '200':
 *         description: Successfully fetched store executives
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: List of store executives under the specified manager
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Executive ID
 *                     example: "abc12345-6789-0def-ghi123456789"
 *                   fullName:
 *                     type: string
 *                     description: Full name of the executive
 *                     example: "Jane Doe"
 *                   email:
 *                     type: string
 *                     description: Email address of the executive
 *                     example: "jane.doe@example.com"
 *                   phoneNumber:
 *                     type: string
 *                     description: Phone number of the executive
 *                     example: "+91-9876543210"
 *                   managerId:
 *                     type: string
 *                     description: ID of the manager the executive reports to
 *                     example: "manager12345"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp of when the executive record was created
 *                     example: "2024-12-20T10:00:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp of when the executive record was last updated
 *                     example: "2024-12-20T12:00:00.000Z"
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Invalid manager ID
 *       '500':
 *         description: Internal Server Error
 */

route.get(
  "/get-all-stores-executives",
  ensureStoresManager,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { managerId } = (req as any).user;
      res.status(StatusCodes.OK).send(await getAllStoresExecutives(managerId));
    } catch (error) {
      next(error);
    }
  }
);
/**
 * @swagger
 * /manager/assign-stores-executive:
 *   post:
 *     summary: Assign a store executive to an order
 *     tags:
 *       - Stores-Manager
 *     description: Assigns a specific store executive to an order and updates the order's store status to "ASSIGNED".
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: The ID of the order to assign
 *                 example: "order12345"
 *               storesExecutiveId:
 *                 type: string
 *                 description: The ID of the store executive to assign
 *                 example: "exec56789"
 *     responses:
 *       '200':
 *         description: Successfully assigned store executive to the order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Successfully stores executive assigned"
 *                 storesData:
 *                   type: object
 *                   description: Details of the assigned relation
 *                   properties:
 *                     orderId:
 *                       type: string
 *                       description: The ID of the assigned order
 *                       example: "order12345"
 *                     storesExecutiveId:
 *                       type: string
 *                       description: The ID of the assigned store executive
 *                       example: "exec56789"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp of when the relation was created
 *                       example: "2024-12-20T10:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp of when the relation was last updated
 *                       example: "2024-12-20T12:00:00.000Z"
 *       '400':
 *         description: Bad Request - Invalid input data
 *       '404':
 *         description: Invalid order ID
 *       '500':
 *         description: Internal Server Error
 */

route.post(
  "/assign-stores-executive",
  ensureStoresManager,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      res.status(StatusCodes.OK).send(await assignStoresExecutiveOrder(data));
    } catch (error) {
      next(error);
    }
  }
);

export default route;
