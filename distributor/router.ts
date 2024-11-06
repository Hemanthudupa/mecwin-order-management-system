import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import {
  addProductsToCart,
  getAllCartProducts,
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

route.get(
  "/get-all-cart-products",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { distributorId } = (req as any).user;
      res.status(StatusCodes.OK).send(await getAllCartProducts(distributorId));
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

export default route;
