import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import {
  addAdvanceAmount,
  addProductCategoary,
  addProductCategoaryImages,
  addProductDetails,
  addProductImages,
  addProductSubCategoary,
  addSalesExecutives,
  createManager,
  deleteManagerByID,
  deleteServiceExecutive,
  getAdvanceAmount,
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
/**
 * @swagger
 * /admin/get-all-user-roles:
 *   get:
 *     summary: Retrieve all user roles
 *     tags:
 *       - Admin
 *     description: Fetches all user roles. Optionally filters by a specific user role if provided in the `options` query parameter.
 *     parameters:
 *       - in: query
 *         name: options
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by a specific user role (case-insensitive). Valid roles include values defined in `USER_ROLES`.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication.
 *     responses:
 *       '200':
 *         description: Successfully fetched user roles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: List of user roles.
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID of the user role.
 *                     example: "role12345"
 *                   userRole:
 *                     type: string
 *                     description: Name of the user role.
 *                     example: "ADMIN"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp of when the user role was created.
 *                     example: "2024-12-20T10:00:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp of when the user role was last updated.
 *                     example: "2024-12-20T12:00:00.000Z"
 *       '400':
 *         description: Bad Request - Invalid user role provided.
 *       '401':
 *         description: Unauthorized.
 *       '500':
 *         description: Internal Server Error.
 */

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

/**
 * @swagger
 * /admin/get-all-products-categoary:
 *   get:
 *     summary: Retrieve all product categories
 *     tags:
 *       - Admin
 *     description: Fetches all product categories along with their types and encoded images.
 *     responses:
 *       '200':
 *         description: Successfully fetched product categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: List of product categories.
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID of the product category.
 *                     example: "category12345"
 *                   categoary_type:
 *                     type: string
 *                     description: Type of the product category.
 *                     example: "Electronics"
 *                   product_categoray_images:
 *                     type: array
 *                     description: List of base64-encoded images for the product category.
 *                     items:
 *                       type: string
 *                       example: "data:image/png;base64,iVBORw0KGgoAAAANS..."
 *       '401':
 *         description: Unauthorized.
 *       '500':
 *         description: Internal Server Error.
 */

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
/**
 * @swagger
 * /admin/add-product-details:
 *   post:
 *     summary: Add a new product
 *     tags:
 *       - Admin
 *     description: Adds a new product with the provided details to the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product.
 *                 example: "Solar Panel"
 *               description:
 *                 type: string
 *                 description: Description of the product.
 *                 example: "High-efficiency solar panel for residential use."
 *               price:
 *                 type: number
 *                 description: Price of the product.
 *                 example: 1500.0
 *               stock:
 *                 type: integer
 *                 description: Available stock of the product.
 *                 example: 100
 *               product_sub_categoary_id:
 *                 type: string
 *                 description: ID of the product's sub-category.
 *                 example: "subcat12345"
 *     responses:
 *       '201':
 *         description: Successfully added the product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Product added successfully"
 *                 product:
 *                   type: object
 *                   description: Details of the added product.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID of the newly added product.
 *                       example: "prod12345"
 *                     name:
 *                       type: string
 *                       description: Name of the product.
 *                       example: "Solar Panel"
 *                     description:
 *                       type: string
 *                       description: Description of the product.
 *                       example: "High-efficiency solar panel for residential use."
 *                     price:
 *                       type: number
 *                       description: Price of the product.
 *                       example: 1500.0
 *                     stock:
 *                       type: integer
 *                       description: Available stock of the product.
 *                       example: 100
 *                     product_sub_categoary_id:
 *                       type: string
 *                       description: ID of the product's sub-category.
 *                       example: "subcat12345"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the product was created.
 *                       example: "2024-12-20T10:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the product was last updated.
 *                       example: "2024-12-20T12:00:00.000Z"
 *       '400':
 *         description: Bad Request - Invalid input data.
 *       '404':
 *         description: Invalid product sub-category ID.
 *       '500':
 *         description: Internal Server Error.
 */

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

/**
 * @swagger
 * /admin/add-product-images/{productId}:
 *   patch:
 *     summary: Add images to a product
 *     tags:
 *       - Admin
 *     description: Uploads and associates images with a specific product by its ID.
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to add images to.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of image files to be uploaded.
 *     responses:
 *       '201':
 *         description: Successfully added images to the product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Image successfully added"
 *       '400':
 *         description: Bad Request - Invalid product ID or missing files.
 *       '404':
 *         description: Product not found.
 *       '500':
 *         description: Internal Server Error.
 */

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

/**
 * @swagger
 * /admin/remove-product-image/{id}:
 *   put:
 *     summary: Remove all images of a product
 *     tags:
 *       - Admin
 *     description: Deletes all images associated with a specific product by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product whose images are to be removed.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication.
 *     responses:
 *       '200':
 *         description: Successfully removed all images from the product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Product images successfully removed"
 *       '404':
 *         description: Product not found or product has no images.
 *       '401':
 *         description: Unauthorized.
 *       '500':
 *         description: Internal Server Error.
 */

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
/**
 * @swagger
 * /admin/add-product-categoary:
 *   post:
 *     summary: Add a new product category
 *     tags:
 *       - Admin
 *     description: Adds a new product category to the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product category.
 *                 example: "Electronics"
 *               description:
 *                 type: string
 *                 description: Description of the product category.
 *                 example: "Category for all electronic products."
 *     responses:
 *       '201':
 *         description: Successfully added the product category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Product category successfully added"
 *                 data:
 *                   type: object
 *                   description: Details of the added product category.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID of the newly created product category.
 *                       example: "cat12345"
 *                     name:
 *                       type: string
 *                       description: Name of the product category.
 *                       example: "Electronics"
 *                     description:
 *                       type: string
 *                       description: Description of the product category.
 *                       example: "Category for all electronic products."
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the product category was created.
 *                       example: "2024-12-20T10:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the product category was last updated.
 *                       example: "2024-12-20T12:00:00.000Z"
 *       '400':
 *         description: Bad Request - Invalid input data.
 *       '500':
 *         description: Internal Server Error.
 */

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

/**
 * @swagger
 * /admin/add-product-categoary-image/{id}:
 *   patch:
 *     summary: Add images to a product category
 *     tags:
 *       - Admin
 *     description: Uploads and associates images with a specific product category by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product category to add images to.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of image files to upload.
 *     responses:
 *       '200':
 *         description: Successfully added images to the product category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Successfully added images for product category"
 *       '400':
 *         description: Bad Request - Invalid product category ID or missing files.
 *       '404':
 *         description: Product category not found.
 *       '500':
 *         description: Internal Server Error.
 */

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

/**
 * @swagger
 * /admin/add-product-sub-categoray:
 *   post:
 *     summary: Add a new product sub-category
 *     tags:
 *       - Admin
 *     description: Creates a new product sub-category and associates it with a parent product category.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product sub-category.
 *                 example: "Smartphones"
 *               description:
 *                 type: string
 *                 description: Description of the product sub-category.
 *                 example: "Sub-category for all smartphone products."
 *               parent_category_id:
 *                 type: string
 *                 description: ID of the parent product category.
 *                 example: "cat12345"
 *     responses:
 *       '201':
 *         description: Successfully created the product sub-category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Product sub-category successfully created"
 *                 product_categoray:
 *                   type: object
 *                   description: Details of the created sub-category.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID of the created sub-category.
 *                       example: "subcat12345"
 *                     name:
 *                       type: string
 *                       description: Name of the sub-category.
 *                       example: "Smartphones"
 *                     description:
 *                       type: string
 *                       description: Description of the sub-category.
 *                       example: "Sub-category for all smartphone products."
 *                     parent_category_id:
 *                       type: string
 *                       description: ID of the parent product category.
 *                       example: "cat12345"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the sub-category was created.
 *                       example: "2024-12-20T10:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the sub-category was last updated.
 *                       example: "2024-12-20T12:00:00.000Z"
 *       '400':
 *         description: Bad Request - Invalid input data.
 *       '500':
 *         description: Internal Server Error.
 */

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

/**
 * @swagger
 * /admin/add-manager:
 *   post:
 *     summary: Create a new manager
 *     tags:
 *       - Admin
 *     description: Adds a new manager and creates an associated user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: Username for the manager.
 *                 example: "john.doe"
 *               userRole:
 *                 type: string
 *                 description: Role of the manager.
 *                 example: "MANAGER"
 *               password:
 *                 type: string
 *                 description: Password for the manager's account.
 *                 example: "password123"
 *               email:
 *                 type: string
 *                 description: Email address of the manager.
 *                 example: "john.doe@example.com"
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number of the manager.
 *                 example: "+1234567890"
 *               employeeId:
 *                 type: string
 *                 description: Employee ID of the manager.
 *                 example: "EMP12345"
 *               work_locations:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of work locations assigned to the manager.
 *                 example: ["New York", "Los Angeles"]
 *               department:
 *                 type: string
 *                 description: Department to which the manager belongs.
 *                 example: "Sales"
 *     responses:
 *       '201':
 *         description: Successfully created the manager.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Successfully manager created"
 *       '400':
 *         description: Bad Request - Invalid input data.
 *       '500':
 *         description: Internal Server Error.
 */

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

/**
 * @swagger
 * /admin/get-all-managers:
 *   get:
 *     summary: Retrieve all managers
 *     tags:
 *       - Admin
 *     description: Fetches a list of all managers. Optionally filters managers by department using the `options` query parameter.
 *     parameters:
 *       - in: query
 *         name: options
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter managers by department (case-insensitive).
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication.
 *     responses:
 *       '200':
 *         description: Successfully fetched managers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: List of managers.
 *               items:
 *                 type: object
 *                 properties:
 *                   managerId:
 *                     type: string
 *                     description: Manager ID.
 *                     example: "mgr12345"
 *                   employeeId:
 *                     type: string
 *                     description: Employee ID of the manager.
 *                     example: "EMP67890"
 *                   work_locations:
 *                     type: array
 *                     description: Work locations assigned to the manager.
 *                     items:
 *                       type: string
 *                     example: ["New York", "Los Angeles"]
 *                   userName:
 *                     type: string
 *                     description: Username of the manager.
 *                     example: "john.doe"
 *                   department:
 *                     type: string
 *                     description: Department of the manager.
 *                     example: "Sales"
 *                   userId:
 *                     type: string
 *                     description: User ID associated with the manager.
 *                     example: "user56789"
 *                   user:
 *                     type: object
 *                     description: Associated user details.
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: User ID.
 *                         example: "user56789"
 *                       userName:
 *                         type: string
 *                         description: Username of the associated user.
 *                         example: "john.doe"
 *                       email:
 *                         type: string
 *                         description: Email address of the associated user.
 *                         example: "john.doe@example.com"
 *                       phoneNumber:
 *                         type: string
 *                         description: Phone number of the associated user.
 *                         example: "+1234567890"
 *                       isActive:
 *                         type: boolean
 *                         description: Whether the user account is active.
 *                         example: true
 *       '400':
 *         description: Bad Request - Invalid input data.
 *       '401':
 *         description: Unauthorized.
 *       '500':
 *         description: Internal Server Error.
 */

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
/**
 * @swagger
 * /admin/delete-manager/{id}:
 *   patch:
 *     summary: Soft delete a manager
 *     tags:
 *       - Admin
 *     description: Marks a manager as inactive by disabling their associated user account.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the manager to delete.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication.
 *     responses:
 *       '200':
 *         description: Successfully soft-deleted the manager.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Manager successfully deleted"
 *       '404':
 *         description: Manager not found or already deleted.
 *       '401':
 *         description: Unauthorized.
 *       '500':
 *         description: Internal Server Error.
 */

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

/**
 * @swagger
 * /admin/add-executives:
 *   post:
 *     summary: Add a new sales executive
 *     tags:
 *       - Admin
 *     description: Creates a new sales executive and associates them with a user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: Username for the sales executive.
 *                 example: "jane.doe"
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number of the sales executive.
 *                 example: "+1234567890"
 *               email:
 *                 type: string
 *                 description: Email address of the sales executive.
 *                 example: "jane.doe@example.com"
 *               userRole:
 *                 type: string
 *                 description: Role of the sales executive.
 *                 example: "SALES_EXECUTIVE"
 *               password:
 *                 type: string
 *                 description: Password for the sales executive's account.
 *                 example: "password123"
 *               employeeId:
 *                 type: string
 *                 description: Employee ID of the sales executive.
 *                 example: "EMP12345"
 *               location:
 *                 type: string
 *                 description: Work location of the sales executive.
 *                 example: "New York"
 *               managerId:
 *                 type: string
 *                 description: Manager ID to whom the sales executive reports.
 *                 example: "mgr56789"
 *     responses:
 *       '201':
 *         description: Successfully created the sales executive.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Sales executive added successfully"
 *       '400':
 *         description: Bad Request - Invalid input data or duplicate email/phone number.
 *       '500':
 *         description: Internal Server Error.
 */

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
/**
 * @swagger
 * /admin/get-all-executives:
 *   get:
 *     summary: Retrieve all sales executives
 *     tags:
 *       - Admin
 *     description: Fetches a list of all active sales executives. Optionally filters executives by department using the `options` query parameter.
 *     parameters:
 *       - in: query
 *         name: options
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter sales executives by department (case-insensitive).
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication.
 *     responses:
 *       '200':
 *         description: Successfully fetched sales executives.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: List of sales executives.
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Sales executive ID.
 *                     example: "exec12345"
 *                   employeeId:
 *                     type: string
 *                     description: Employee ID of the sales executive.
 *                     example: "EMP67890"
 *                   location:
 *                     type: string
 *                     description: Work location of the sales executive.
 *                     example: "New York"
 *                   user:
 *                     type: object
 *                     description: Details of the associated user account.
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: User ID.
 *                         example: "user56789"
 *                       userName:
 *                         type: string
 *                         description: Username of the user account.
 *                         example: "jane.doe"
 *                       email:
 *                         type: string
 *                         description: Email address of the user.
 *                         example: "jane.doe@example.com"
 *                       phoneNumber:
 *                         type: string
 *                         description: Phone number of the user.
 *                         example: "+1234567890"
 *                       isActive:
 *                         type: boolean
 *                         description: Whether the user account is active.
 *                         example: true
 *                   manager:
 *                     type: object
 *                     description: Details of the manager the sales executive reports to.
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Manager ID.
 *                         example: "mgr12345"
 *                       department:
 *                         type: string
 *                         description: Department of the manager.
 *                         example: "Sales"
 *       '400':
 *         description: Bad Request - Invalid input data.
 *       '401':
 *         description: Unauthorized.
 *       '500':
 *         description: Internal Server Error.
 */

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
/**
 * @swagger
 * /admin/delete-service-engineer/{id}:
 *   patch:
 *     summary: Soft delete a service executive
 *     tags:
 *       - Admin
 *     description: Marks a service executive as inactive by disabling their associated user account.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the service executive to delete.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication.
 *     responses:
 *       '200':
 *         description: Successfully soft-deleted the service executive.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Service executive deleted successfully"
 *       '404':
 *         description: Service executive not found or already deleted.
 *       '401':
 *         description: Unauthorized.
 *       '500':
 *         description: Internal Server Error.
 */

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

app.post(
  "/add-advance-amount",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      res.status(StatusCodes.CREATED).send(await addAdvanceAmount(data));
    } catch (error) {
      next(error);
    }
  }
);

export default app;
