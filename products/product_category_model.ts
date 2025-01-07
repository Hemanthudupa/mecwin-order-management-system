import {
  CreationOptional,
  DATE,
  InferAttributes,
  InferCreationAttributes,
  Model,
  STRING,
  UUID,
  UUIDV4,
} from "sequelize";
import { PRODUCTS_CATEGOARY } from "../utils/constants";
import sequelize from "../database";

export class Product_Categoary extends Model<
  InferAttributes<Product_Categoary>,
  InferCreationAttributes<Product_Categoary>
> {
  declare id: CreationOptional<string>;
  declare categoary_type: CreationOptional<string>;
  declare product_categoray_images: CreationOptional<string>;
  declare product_categoray_name: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Product_Categoary.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    categoary_type: {
      type: STRING,
      validate: {
        isIn: {
          args: [Object.values(PRODUCTS_CATEGOARY)],
          msg: "categaoary should be proper",
        },
      },
    },
    product_categoray_name: {
      type: STRING,
    },
    createdAt: {
      type: DATE,
    },
    updatedAt: {
      type: DATE,
    },
    product_categoray_images: {
      type: STRING,
    },
  },

  {
    sequelize,
    modelName: "product_categoary",
    tableName: "product_categoary",
    timestamps: true,
  }
);
