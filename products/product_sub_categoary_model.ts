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
import { Product_Categoary } from "./product_category_model";

export class Product_Sub_Categoary extends Model<
  InferAttributes<Product_Sub_Categoary>,
  InferCreationAttributes<Product_Sub_Categoary>
> {
  declare id: CreationOptional<string>;
  declare product_categoray_id: CreationOptional<string>;
  declare product_sub_categoray_name: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Product_Sub_Categoary.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    product_categoray_id: {
      type: UUID,
      references: {
        model: Product_Categoary,
        key: "id",
      },
    },
    product_sub_categoray_name: {
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
    sequelize,
    modelName: "Product_Sub_Categoary",
    tableName: "product_sub_categoary",
    timestamps: true,
  }
);

Product_Sub_Categoary.belongsTo(Product_Categoary, {
  foreignKey: "product_categoray_id",
});
