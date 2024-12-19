import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import {
  addProductCategoary,
  addProductCategoaryImages,
  addProductDetails,
  addProductImages,
  addProductSubCategoary,
  addSalesExecutives,
  createManager,
  deleteManagerByID,
  deleteServiceExecutive,
  getAllManagers,
  getAllProductsCategoray,
  getAllSalesExecutives,
  getAllUserRoles,
  removeProductImage,
} from "./module";
import { ensureSystemAdmin } from "../utils/authentication";
import { fileMulter } from "../utils/files/distributor_attachments/attachments";
import { product_images_multer } from "../utils/files/product_images/files";
import { join } from "path";
const app = Router();

app.get(
  "/get-all-user-roles",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { options } = req.query;
      res.status(StatusCodes.OK).send(await getAllUserRoles(options as string));
    } catch (error) {
      next(error);
    }
  }
);

app.get(
  "/get-all-products-categoary",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(StatusCodes.OK).send(await getAllProductsCategoray());
    } catch (error) {
      next(error);
    }
  }
);
app.use(ensureSystemAdmin);
app.post(
  "/add-product-details",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product_details = req.body;
      res
        .status(StatusCodes.CREATED)
        .send(await addProductDetails(product_details));
    } catch (error) {
      next(error);
    }
  }
);

app.patch(
  "/add-product-images/:productId",
  product_images_multer.array("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;

      res.status(StatusCodes.CREATED).send(
        await addProductImages(
          productId,
          (req.files as any)
            .map((ele: any) => {
              return ele.savedFileNamePath;
            })
            .join(";")
        )
      );
    } catch (error) {
      next(error);
    }
  }
);

// app.get(
//   "/get-all-product-images/:id",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { id } = req.params;
//       res.status(StatusCodes.OK).json(await getAllProductImages(id));
//     } catch (error) {
//       next(error);
//     }
//   }
// );

app.put(
  "/remove-product-image/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      res.status(StatusCodes.OK).send(await removeProductImage(id));
    } catch (error) {
      next(error);
    }
  }
);

app.post(
  "/add-product-categoary",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const details = req.body;
      res.status(StatusCodes.CREATED).send(await addProductCategoary(details));
    } catch (error) {
      next(error);
    }
  }
);

app.patch(
  "/add-product-categoary-image/:id",
  product_images_multer.array("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      res.status(StatusCodes.OK).send(
        await addProductCategoaryImages(
          id,
          (req.files as any)
            .map((ele: any) => {
              return ele.savedFileNamePath;
            })
            .join(";")
        )
      );
    } catch (error) {
      next(error);
    }
  }
);

app.post(
  "/add-product-sub-categoray",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = (req as any).body;
      res.status(StatusCodes.CREATED).send(await addProductSubCategoary(data));
    } catch (error) {
      next(error);
    }
  }
);

app.post(
  "/add-manager",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      console.log("it came here now ");
      res.status(StatusCodes.CREATED).send(await createManager(data));
    } catch (error) {
      next(error);
    }
  }
);

app.get(
  "/get-all-managers",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { options } = req.query;
      res.status(StatusCodes.OK).send(await getAllManagers(options as string));
    } catch (error) {
      next(error);
    }
  }
);

app.patch(
  "/delete-manager/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      res.status(StatusCodes.OK).send(await deleteManagerByID(id));
    } catch (error) {
      next(error);
    }
  }
);

app.post(
  "/add-executives",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      res.status(StatusCodes.CREATED).send(await addSalesExecutives(data));
    } catch (error) {
      next(error);
    }
  }
);

app.get(
  "/get-all-executives",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { options } = req.query;
      res
        .status(StatusCodes.OK)
        .send(await getAllSalesExecutives(options as string));
    } catch (error) {
      next(error);
    }
  }
);

app.patch(
  "/delete-service-engineer/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      res
        .status(StatusCodes.OK)
        .send(await deleteServiceExecutive(id as string));
    } catch (error) {
      next(error);
    }
  }
);

// app.patch(
//   "/add-product-sub-categoray-images",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const data = (req as any).body;
//       res.status(StatusCodes.OK).send(await addProductSubCategoary(data));
//     } catch (error) {
//       next(error);
//     }
//   }
// );

export default app;
