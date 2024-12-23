import express, { NextFunction, Request, Response } from "express";
export const app = express();
import user from "./user/router";
import { APIError } from "./utils/Error";
import { StatusCodes } from "http-status-codes";
import { ensureUser } from "./utils/authentication";
import admin from "./admin/router";
import distributor from "./distributor/router";
import manager from "./managers/router";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi, { SwaggerOptions } from "swagger-ui-express";
import accounts from "./accounts/router";
import yaml from "yamljs";
// import morgan from "morgan";
// app.use(morgan("dev"));
import executive from "./executives/router";

import { serve, setup } from "swagger-ui-express";
import planning from "./planning/router";

import hpp from "hpp";
import cors from "cors";
// const swaggerDocument = yaml.load("./utils/swagger.yaml");

app.use(cors());
app.use(hpp());
const options: SwaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title:
        "swagger documentation for MECWIN ORDER MANAGEMENT SYSTEM PROJECT ",
      version: "1.0.0",
    },
    swaggerOptions: {
      url: "https://www.mecwinnetra.com/oms",
    },
    servers: [
      // Defines the server URLs where the API is hosted
      {
        url: "https://www.mecwinnetra.com/oms", // URL of the local server
        description: "mecwin - order - management Development server",
      },
      // You can add more server objects for different environments (e.g., production)
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [],
  },
  apis: [
    "./user/router.ts",
    "./admin/router.ts",
    "./distributor/router.ts",
    "./managers/router.ts",
    "./executives/router.ts",
    "./accounts/router.ts",
  ],
};

const swaggerDocs = swaggerJsDoc(options);
app.use("/api-docs-oms", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((req, res, next) => {
  req.on("end", () => {
    console.log(`Request: ${req.method} ${req.url}`);
  });
  res.on("finish", () => {
    console.log(`Response: ${res.statusCode}`);
  });
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", user);
app.use(ensureUser);

app.use("/admin", admin);
app.use("/accounts", accounts);
app.use("/distributor", distributor);
app.use("/manager", manager);
app.use("/executive", executive);
app.use("/planning", planning);
app.use(errorHandler);
function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof APIError) {
    console.log((err as APIError).message, (err as APIError).code);
    res.status(StatusCodes.BAD_REQUEST).send({
      message: (err as APIError).message,
      code: (err as APIError).code,
    });
  } else {
    console.log(err.message, 400);
    res.status(StatusCodes.BAD_REQUEST).send({
      message: err.message,
      code: (err as APIError).code || "INVALID CODE !!!",
    });
  }
}
