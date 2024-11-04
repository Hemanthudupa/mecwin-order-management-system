import {
  CreationAttributes,
  CreationOptional,
  DATE,
  DOUBLE,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  STRING,
  UUID,
  UUIDV4,
} from "sequelize";
import { Product_Categoary } from "./product_category_model";
import sequelize from "../database";

export class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  declare id: CreationOptional<string>;
  declare product_name: CreationOptional<string>;
  declare product_categoary: ForeignKey<Product_Categoary>;
  declare details: CreationOptional<string>;
  declare price: CreationOptional<number>;
  declare gst: CreationOptional<number>;
  declare discount: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
Product.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    product_categoary: {
      type: UUID,
      references: {
        model: Product_Categoary,
        key: "id",
      },
    },
    details: {
      type: STRING,
    },
    gst: {
      type: DOUBLE,
    },
    price: {
      type: DOUBLE,
    },
    discount: {
      type: DOUBLE,
    },
    product_name: {
      type: STRING,
    },
    createdAt: {
      type: DATE,
    },
    updatedAt: {
      type: DATE,
    },
  },

  {
    sequelize: sequelize,
    modelName: "products",
    tableName: "products",
    timestamps: true,
  }
);
