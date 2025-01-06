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
import { getAdvanceAmount } from "../admin/module";
import { getStoresOrderById } from "../managers/module";
const app = Router();
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - User
 *     description: Authenticates a user using either email or phone number along with a password and returns a JWT token and user role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address (optional if phone number is provided).
 *                 example: "user@example.com"
 *               phoneNumber:
 *                 type: string
 *                 description: User's phone number (optional if email is provided).
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: "password123"
 *     responses:
 *       '200':
 *         description: Successfully authenticated the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for the authenticated user.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 userRole:
 *                   type: string
 *                   description: Role of the authenticated user.
 *                   example: "ADMIN"
 *       '400':
 *         description: Bad Request - Invalid inputs or missing required fields.
 *       '401':
 *         description: Unauthorized - Invalid email, phone number, or password.
 *       '500':
 *         description: Internal Server Error.
 */

app.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phoneNumber, password } = req.body;

    res.status(StatusCodes.OK).send(await login(email, phoneNumber, password));
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /user/register-distributor:
 *   post:
 *     summary: Register a new distributor
 *     tags:
 *       - User
 *     description: Registers a new distributor and creates an associated user account.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the distributor.
 *                 example: "distributor@example.com"
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number of the distributor.
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 description: Password for the distributor's account.
 *                 example: "password123"
 *               fullName:
 *                 type: string
 *                 description: Full name of the distributor.
 *                 example: "John Doe"
 *               gstNumber:
 *                 type: string
 *                 description: GST number of the distributor.
 *                 example: "22AAAAA0000A1Z5"
 *               panNumber:
 *                 type: string
 *                 description: PAN number of the distributor.
 *                 example: "ABCDE1234F"
 *               shipping_Address:
 *                 type: string
 *                 description: Shipping address of the distributor.
 *                 example: "123 Street, Industrial Area"
 *               billing_Address:
 *                 type: string
 *                 description: Billing address of the distributor.
 *                 example: "456 Avenue, Business District"
 *               priorExperience:
 *                 type: string
 *                 description: Prior experience of the distributor.
 *                 example: "5 years in electronics distribution"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Attachment (e.g., supporting documents) for the distributor.
 *     responses:
 *       '201':
 *         description: Successfully registered the distributor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Distributor created successfully"
 *       '400':
 *         description: Bad Request - Invalid input data or duplicate email/phone number.
 *       '500':
 *         description: Internal Server Error.
 */

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
/**
 * @swagger
 * /user/add-user-role:
 *   post:
 *     summary: Add a new user role
 *     tags:
 *       - User
 *     description: Creates a new user role if it does not already exist.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userRole:
 *                 type: string
 *                 description: Name of the user role to create.
 *                 example: "MANAGER"
 *     responses:
 *       '201':
 *         description: Successfully created the user role.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: Details of the created user role.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID of the created user role.
 *                       example: "role12345"
 *                     userRole:
 *                       type: string
 *                       description: Name of the user role.
 *                       example: "MANAGER"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the user role was created.
 *                       example: "2024-12-20T10:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the user role was last updated.
 *                       example: "2024-12-20T12:00:00.000Z"
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Successfully created user role"
 *       '400':
 *         description: Bad Request - Invalid input data.
 *       '409':
 *         description: Conflict - User role already exists.
 *       '500':
 *         description: Internal Server Error.
 */

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

/**
 * @swagger
 * /user/get-all-products:
 *   get:
 *     summary: Retrieve all products
 *     tags:
 *       - User
 *     description: Fetches all products and their details, including base64-encoded images for easy rendering in the frontend.
 *     responses:
 *       '200':
 *         description: Successfully fetched all products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: List of all products.
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Product ID.
 *                     example: "prod12345"
 *                   name:
 *                     type: string
 *                     description: Name of the product.
 *                     example: "Solar Panel"
 *                   description:
 *                     type: string
 *                     description: Description of the product.
 *                     example: "High-efficiency solar panel for residential use."
 *                   price:
 *                     type: number
 *                     description: Price of the product.
 *                     example: 1500.0
 *                   stock:
 *                     type: integer
 *                     description: Available stock of the product.
 *                     example: 100
 *                   product_image:
 *                     type: string
 *                     format: binary
 *                     description: Base64-encoded image of the product.
 *                     example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD..."
 *       '500':
 *         description: Internal Server Error.
 */

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

/**
 * @swagger
 * /user/get-product/{id}:
 *   get:
 *     summary: Retrieve product details by ID
 *     tags:
 *       - User
 *     description: Fetches details of a product by its ID, including its images as base64-encoded strings.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to fetch.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication.
 *     responses:
 *       '200':
 *         description: Successfully fetched the product details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Product ID.
 *                   example: "prod12345"
 *                 name:
 *                   type: string
 *                   description: Name of the product.
 *                   example: "Solar Panel"
 *                 description:
 *                   type: string
 *                   description: Description of the product.
 *                   example: "High-efficiency solar panel for residential use."
 *                 price:
 *                   type: number
 *                   description: Price of the product.
 *                   example: 1500.0
 *                 stock:
 *                   type: integer
 *                   description: Available stock of the product.
 *                   example: 100
 *                 product_images:
 *                   type: array
 *                   description: List of base64-encoded images of the product.
 *                   items:
 *                     type: string
 *                     example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD..."
 *       '404':
 *         description: Product not found or invalid product ID.
 *       '500':
 *         description: Internal Server Error.
 */

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

/**
 * @swagger
 * /user/get-advance-amount:
 *   get:
 *     summary: Retrieve all advance amounts
 *     tags:
 *       - User
 *     description: Fetches a list of all available advance amounts from the database.
 *     responses:
 *       '200':
 *         description: Successfully retrieved advance amounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier for the advance amount record
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                   advanceAmt:
 *                     type: string
 *                     description: The advance amount value
 *                     example: "5000"
 *       '500':
 *         description: Internal Server Error - Failed to fetch advance amounts
 */

app.get(
  "/get-advance-amount",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(StatusCodes.OK).send(await getAdvanceAmount());
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /manager/get-order/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags:
 *       - utils
 *     description: Retrieves detailed information about a specific order based on the provided order ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to retrieve
 *     responses:
 *       '200':
 *         description: Successfully fetched order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Order ID
 *                   example: "12345"
 *                 customers:
 *                   type: object
 *                   description: Details of the customer who placed the order
 *                   properties:
 *                     companyName:
 *                       type: string
 *                       description: Name of the customer's company
 *                       example: "ABC Pvt Ltd"
 *                     gstNumber:
 *                       type: string
 *                       description: GST number of the customer
 *                       example: "29ABCDE1234F1Z5"
 *                     panNumber:
 *                       type: string
 *                       description: PAN number of the customer
 *                       example: "ABCDE1234F"
 *                     priorExperience:
 *                       type: boolean
 *                       description: Whether the customer has prior experience
 *                       example: true
 *                     fullName:
 *                       type: string
 *                       description: Full name of the customer
 *                       example: "John Doe"
 *                     phoneNumber:
 *                       type: string
 *                       description: Phone number of the customer
 *                       example: "+91-9876543210"
 *                     email:
 *                       type: string
 *                       description: Email address of the customer
 *                       example: "john.doe@example.com"
 *                     shipping_Address:
 *                       type: string
 *                       description: Shipping address of the customer
 *                       example: "123 Street Name, Industrial Area"
 *                     shipping_Address_city:
 *                       type: string
 *                       description: City of the shipping address
 *                       example: "Bangalore"
 *                     shipping_Address_state:
 *                       type: string
 *                       description: State of the shipping address
 *                       example: "Karnataka"
 *                     shipping_Address_pincode:
 *                       type: string
 *                       description: Pincode of the shipping address
 *                       example: "560001"
 *                     billing_Address:
 *                       type: string
 *                       description: Billing address of the customer
 *                       example: "456 Avenue Road, Business District"
 *                     billing_Address_city:
 *                       type: string
 *                       description: City of the billing address
 *                       example: "Bangalore"
 *                     billing_Address_state:
 *                       type: string
 *                       description: State of the billing address
 *                       example: "Karnataka"
 *                     billing_Address_pincode:
 *                       type: string
 *                       description: Pincode of the billing address
 *                       example: "560002"
 *       '400':
 *         description: Bad Request - Invalid order ID
 *       '404':
 *         description: Order not found
 *       '500':
 *         description: Internal Server Error
 */

app.get(
  "/get-order/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      res.status(StatusCodes.OK).send(await getStoresOrderById(id));
    } catch (error) {
      next(error);
    }
  }
);
export default app;
