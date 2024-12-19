import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import {
  acceptNegotiatedOrder,
  addProductsToCart,
  deleteCartItemById,
  getAllCartProducts,
  getAllNegotiatedOrders,
  placeCartOrders,
} from "./module";
import { ensureDistributor } from "../utils/authentication";
const route = Router();
route.use(ensureDistributor);
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
export default route;
