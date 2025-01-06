import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import {
  acceptNegotiatedOrder,
  addProductsToCart,
  deleteCartItemById,
  getAllCartProducts,
  getAllNegotiatedOrders,
  placeCartOrders,
  rejectNegotiatedOrder,
} from "./module";
import { ensureDistributor } from "../utils/authentication";
const route = Router();
route.use(ensureDistributor);

/**
 * @swagger
 * /distributor/add-products-cart:
 *   post:
 *     summary: Add products to the cart
 *     tags:
 *       - Distributor
 *     description: Allows a distributor to add products to their cart by specifying the product ID and quantity.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product to add to the cart.
 *                 example: "prod12345"
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product to add (defaults to 0 if not provided).
 *                 example: 10
 *     responses:
 *       '201':
 *         description: Product successfully added to the cart.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Product successfully added to cart"
 *                 cart:
 *                   type: object
 *                   description: Details of the added cart entry.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID of the cart entry.
 *                       example: "cart12345"
 *                     customerId:
 *                       type: string
 *                       description: ID of the distributor who added the product.
 *                       example: "dist67890"
 *                     productId:
 *                       type: string
 *                       description: ID of the product added to the cart.
 *                       example: "prod12345"
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the product added to the cart.
 *                       example: 10
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp of when the cart entry was created.
 *                       example: "2024-12-20T10:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp of when the cart entry was last updated.
 *                       example: "2024-12-20T12:00:00.000Z"
 *       '400':
 *         description: Bad Request - Invalid input data or missing required fields.
 *       '404':
 *         description: Invalid distributor ID or product ID.
 *       '500':
 *         description: Internal Server Error.
 */

route.post(
  "/add-products-cart",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, quantity = 0 } = req.body;
      const { distributorId } = (req as any).user;

      console.log(distributorId);
      res
        .status(StatusCodes.CREATED)
        .send(await addProductsToCart(productId, quantity, distributorId));
    } catch (error) {
      next(error);
    }
  }
);
/**
 * @swagger
 * /distributor/delete-cart-item/{id}:
 *   post:
 *     summary: Remove a product from the cart
 *     tags:
 *       - Distributor
 *     description: Deletes a specific product from the distributor's cart by cart item ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cart item to remove.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication.
 *     responses:
 *       '200':
 *         description: Successfully removed the product from the cart.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Successfully product removed from the cart successfully"
 *       '404':
 *         description: Invalid cart ID - Cart item not found.
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

route.post(
  "/delete-cart-item/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      res.status(StatusCodes.OK).send(await deleteCartItemById(id));
    } catch (error) {
      next(error);
    }
  }
);
/**
 * @swagger
 * /distributor/get-all-cart-products:
 *   get:
 *     summary: Retrieve all products in the cart
 *     tags:
 *       - Distributor
 *     description: Fetches all products in the distributor's cart or the count of products based on the `options` query parameter.
 *     parameters:
 *       - in: query
 *         name: options
 *         schema:
 *           type: string
 *           enum: [count]
 *         required: false
 *         description: If set to `count`, returns only the count of products in the cart.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication.
 *     responses:
 *       '200':
 *         description: Successfully fetched cart details or count.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Count of products in the cart (if `options=count`).
 *                   example: 5
 *                 data:
 *                   type: array
 *                   description: List of products in the cart (if `options` is not set).
 *                   items:
 *                     type: object
 *                     properties:
 *                       cartId:
 *                         type: string
 *                         description: Cart item ID.
 *                         example: "cart12345"
 *                       customerId:
 *                         type: string
 *                         description: ID of the distributor owning the cart.
 *                         example: "dist67890"
 *                       quantity:
 *                         type: integer
 *                         description: Quantity of the product in the cart.
 *                         example: 10
 *                       products:
 *                         type: object
 *                         description: Details of the product in the cart.
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: Product ID.
 *                             example: "prod12345"
 *                           name:
 *                             type: string
 *                             description: Name of the product.
 *                             example: "Solar Panel"
 *                           price:
 *                             type: number
 *                             description: Price of the product.
 *                             example: 1000.0
 *                       productImages:
 *                         type: array
 *                         description: List of product image URLs.
 *                         items:
 *                           type: string
 *                           example: "https://example.com/image1.jpg"
 *       '400':
 *         description: Bad Request - Invalid options provided.
 *       '401':
 *         description: Unauthorized.
 *       '500':
 *         description: Internal Server Error.
 */

route.get(
  "/get-all-cart-products",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { options } = req.query;
      const { distributorId } = (req as any).user;
      res
        .status(StatusCodes.OK)
        .send(await getAllCartProducts(distributorId, options as string));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /distributor/place-cart-orders:
 *   post:
 *     summary: Place orders for products in the cart
 *     tags:
 *       - Distributor
 *     description: Creates orders for all products in the distributor's cart and removes them from the cart upon successful order creation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shipping_Address:
 *                 type: string
 *                 description: Shipping address for the order (optional).
 *                 example: "123 Street Name, Industrial Area"
 *               billing_Address:
 *                 type: string
 *                 description: Billing address for the order (optional).
 *                 example: "456 Avenue Road, Business District"
 *               remarks:
 *                 type: string
 *                 description: Additional remarks for the order (optional).
 *                 example: "Deliver on weekends"
 *     responses:
 *       '201':
 *         description: Successfully placed orders for cart products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Successfully created order"
 *                 createdOrders:
 *                   type: array
 *                   description: List of orders created.
 *                   items:
 *                     type: object
 *                     properties:
 *                       customerId:
 *                         type: string
 *                         description: ID of the distributor who placed the order.
 *                         example: "dist67890"
 *                       productId:
 *                         type: string
 *                         description: ID of the product in the order.
 *                         example: "prod12345"
 *                       quantity:
 *                         type: integer
 *                         description: Quantity of the product in the order.
 *                         example: 10
 *                       shipping_Address:
 *                         type: string
 *                         description: Shipping address for the order.
 *                         example: "123 Street Name, Industrial Area"
 *                       billing_Address:
 *                         type: string
 *                         description: Billing address for the order.
 *                         example: "456 Avenue Road, Business District"
 *                       remarks:
 *                         type: string
 *                         description: Additional remarks for the order.
 *                         example: "Deliver on weekends"
 *                       price:
 *                         type: number
 *                         description: Total price of the order.
 *                         example: 5000.0
 *       '400':
 *         description: Bad Request - Invalid input data.
 *       '404':
 *         description: Distributor or product not found.
 *       '500':
 *         description: Internal Server Error.
 */

route.post(
  "/place-cart-orders",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { distributorId } = (req as any).user;
      const data = req.body;

      res
        .status(StatusCodes.CREATED)
        .send(await placeCartOrders(distributorId, data));
    } catch (error) {
      next(error);
    }
  }
);
/**
 * @swagger
 * /distributor/get-all-negotiation-orders:
 *   get:
 *     summary: Retrieve all negotiated orders
 *     tags:
 *       - Distributor
 *     description: Fetches all orders for a distributor with a sales negotiation status of "PENDING ACCEPTANCE."
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication.
 *     responses:
 *       '200':
 *         description: Successfully fetched negotiated orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: List of orders with "PENDING ACCEPTANCE" status.
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Order ID.
 *                     example: "order12345"
 *                   customerId:
 *                     type: string
 *                     description: Distributor ID who owns the order.
 *                     example: "dist67890"
 *                   sales_negotiation_status:
 *                     type: string
 *                     description: Status of the sales negotiation.
 *                     example: "PENDING ACCEPTANCE"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp of when the order was created.
 *                     example: "2024-12-20T10:00:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp of when the order was last updated.
 *                     example: "2024-12-20T12:00:00.000Z"
 *       '401':
 *         description: Unauthorized.
 *       '500':
 *         description: Internal Server Error.
 */

route.get(
  "/get-all-negotiation-orders",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { distributorId } = (req as any).user;
      res
        .status(StatusCodes.OK)
        .send(await getAllNegotiatedOrders(distributorId));
    } catch (error) {
      next(error);
    }
  }
);
/**
 * @swagger
 * /distributor/accept-negotiated-order/{orderId}:
 *   patch:
 *     summary: Accept a negotiated order
 *     tags:
 *       - Distributor
 *     description: Updates the status of a negotiated order to "NEGOTIATED" and marks the sales order relation as inactive.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to accept.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication.
 *     responses:
 *       '200':
 *         description: Successfully accepted the negotiated order.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Customer happy with the negotiated money"
 *       '404':
 *         description: Order or sales order relation not found.
 *       '401':
 *         description: Unauthorized.
 *       '500':
 *         description: Internal Server Error.
 */

route.patch(
  "/accept-negotiated-order/:orderId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params;
      res.status(StatusCodes.OK).send(await acceptNegotiatedOrder(orderId));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /distributor/reject-negotiated-order/{orderId}:
 *   patch:
 *     summary: Reject a negotiated order
 *     tags:
 *       - Distributor
 *     description: Allows a customer to reject a negotiated order. The order must not already be rejected and must not be approved by the customer.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the order to reject
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       '200':
 *         description: Successfully rejected the negotiated order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "negotiated order rejected successfully by customer"
 *       '400':
 *         description: Bad Request - Invalid or missing order ID
 *       '404':
 *         description: Not Found - Order ID does not exist or order already rejected
 *       '500':
 *         description: Internal Server Error - Failed to reject the order
 */

route.patch(
  "/reject-negotiated-order/:orderId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params;
      res.status(StatusCodes.OK).send(await rejectNegotiatedOrder(orderId));
    } catch (error) {
      next(error);
    }
  }
);
export default route;
