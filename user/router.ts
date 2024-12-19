import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import {
  addUserRole,
  createDistributor,
  getAllProducts,
  getProductById,
  login,
} from "./module";
import { join } from "path";
import { fileMulter } from "../utils/files/distributor_attachments/attachments";
import sharp from "sharp";
import compressPDF from "pdf-compressor";
const app = Router();
app.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phoneNumber, password } = req.body;
    res.status(StatusCodes.OK).send(await login(email, phoneNumber, password));
  } catch (error) {
    next(error);
  }
});

app.post(
  "/register-distributor",
  fileMulter.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      // sharp(req.file?.buffer)
      //   .resize({
      //     width: 800,
      //     fit: sharp.fit.inside,
      //   })
      //   .withMetadata()
      //   .toFile(
      //     join(
      //       __dirname,
      //       "..",
      //       "utils",
      //       "files",
      //       "attachments",
      //       req.file!.originalname.split(".")[0] + ".JPEG"
      //     )
      //   );
      data.attachments = join(
        __dirname,
        "..",
        "utils",
        "files",
        "attachments",
        `${(req as any).fileName}`
      );

      console.log(data);
      res.status(StatusCodes.CREATED).send(await createDistributor(data));
    } catch (error) {
      next(error);
    }
  }
);

app.post(
  "/add-user-role",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const role = req.body;
      res.status(StatusCodes.CREATED).send(await addUserRole(role));
    } catch (error) {
      next(error);
    }
  }
);

app.get(
  "/get-all-products",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(StatusCodes.OK).json(await getAllProducts());
    } catch (error) {
      next(error);
    }
  }
);

app.get(
  "/get-product/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      res.status(StatusCodes.OK).send(await getProductById(id));
    } catch (error) {
      next(error);
    }
  }
);
export default app;
