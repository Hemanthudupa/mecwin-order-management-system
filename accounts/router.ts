import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { getAdvanceAmount } from "../admin/module";
import { accountsApproveOrder, getAdvanceAmountPayedOrders } from "./module";
const route = Router();

/**
 * @swagger
 * /accounts/get-advance-amt-payed-orders:
 *   get:
 *     summary: Get orders with advance amount paid
 *     tags:
 *       - Accounts
 *     description: Retrieve a list of orders where the advance amount is not approved by accounts and does not match the predefined advance amount.
 *     responses:
 *       '200':
 *         description: A successful response containing the list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The order ID
 *                     example: "12345"
 *                   approved_by_accounts:
 *                     type: boolean
 *                     description: Indicates if the order's advance amount is approved by accounts
 *                     example: false
 *                   advanceAmount:
 *                     type: number
 *                     description: The advance amount paid for the order
 *                     example: 5000
 *       '400':
 *         description: Bad Request - Invalid request or missing data
 *       '500':
 *         description: Internal Server Error - Failed to retrieve orders
 */

route.get(
  "/get-advance-amt-payed-orders",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(StatusCodes.OK).send(await getAdvanceAmountPayedOrders());
    } catch (error) {
      next(error);
    }
  }
);
/**
 * @swagger
 * /accounts/approve-order/{id}:
 *   patch:
 *     summary: Approve an order by accounts
 *     tags:
 *       - Accounts
 *     description: Approves an order by updating the `approved_by_accounts` field to `true`.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the order to approve
 *         example: "12345"
 *     responses:
 *       '200':
 *         description: Successfully approved the order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "order approved by accounts successfully"
 *       '400':
 *         description: Bad Request - Invalid or missing order ID
 *       '404':
 *         description: Not Found - Order ID does not exist
 *       '500':
 *         description: Internal Server Error - Failed to approve the order
 */

route.patch(
  "/approve-order/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      res.status(StatusCodes.OK).send(await accountsApproveOrder(id as string));
    } catch (error) {
      next(error);
    }
  }
);

export default route;
