import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import {
  getAllStoresExecutiveOrders,
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

route.get(
  "/get-sales-executive-orders",
  ensureSalesExecutive,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { salesExcecutiveId: id } = (req as any).user;
      const { from, to, time, searchById } = req.query;
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
export default route;
