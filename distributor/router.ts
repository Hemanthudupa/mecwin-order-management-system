import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { addProductsToCart } from "./module";
const route = Router();
route.post(
  "/add-products-cart/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, quantity = 0 } = req.body;
      const { distributorId } = (req as any).user;
      res
        .status(StatusCodes.CREATED)
        .send(await addProductsToCart(productId, quantity, distributorId));
    } catch (error) {
      next(error);
    }
  }
);

export default route;
