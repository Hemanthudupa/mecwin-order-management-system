import {
  CreationOptional,
  DATE,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  STRING,
  UUID,
  UUIDV4,
} from "sequelize";
import { Product } from "./model";
import sequelize from "../database";

export class Product_Image extends Model<
  InferAttributes<Product_Image>,
  InferCreationAttributes<Product_Image>
> {
  declare id: CreationOptional<string>;
  declare product_image: CreationOptional<string>;
  declare productId: ForeignKey<Product_Image>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
Product_Image.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    product_image: {
      type: STRING,
    },
    productId: {
      type: UUID,
      references: {
        model: Product,
        key: "id",
      },
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
    tableName: "product_images",
    modelName: "product_images",
    timestamps: true,
  }
);
