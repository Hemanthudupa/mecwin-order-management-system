import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { getSalesExecutiveOrders, updateOrderDetails } from "./module";
import { ensureSalesExecutive } from "../utils/authentication";
const route = Router();

route.get(
  "/get-sales-executive-orders",
  ensureSalesExecutive,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { salesExcecutiveId: id } = (req as any).user;
      const { from, to, time } = req.query;
      res
        .status(StatusCodes.OK)
        .send(
          await getSalesExecutiveOrders(
            id as string,
            from as any,
            to as any,
            time as any
          )
        );
    } catch (error) {
      next(error);
    }
  }
);

route.patch(
  "/update-order-details",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const info = (req as any).body;
      res.status(StatusCodes.OK).send(await updateOrderDetails(info));
    } catch (error) {
      next(error);
    }
  }
);
export default route;
