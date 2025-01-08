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
  TEXT,
  UUID,
  UUIDV4,
} from "sequelize";
import { Product_Categoary } from "./product_category_model";
import sequelize from "../database";
import { Product_Sub_Categoary } from "./product_sub_categoary_model";
import { Order } from "../order/model";

export class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  declare id: CreationOptional<string>;
  declare product_name: CreationOptional<string>;
  declare product_sub_categoary_id: ForeignKey<Product_Sub_Categoary>;
  declare details: CreationOptional<string>;
  declare price: CreationOptional<number>;
  declare gst: CreationOptional<number>;
  declare discount: CreationOptional<number>;
  declare product_image: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare product_categoary: ForeignKey<Product_Categoary>;
}
Product.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    product_sub_categoary_id: {
      type: UUID,
      references: {
        model: Product_Sub_Categoary,
        key: "id",
      },
    },

    product_image: {
      type: TEXT,
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
    product_categoary: {
      type: UUID,
      references: {
        model: Product_Categoary,
        key: "id",
      },
    },
  },

  {
    sequelize: sequelize,
    modelName: "products",
    tableName: "products",
    timestamps: true,
  }
);

Product.belongsTo(Product_Sub_Categoary, {
  foreignKey: "product_sub_categoary_id",
});
Product.belongsTo(Product_Categoary, {
  foreignKey: "product_categoary",
  as: "product_categoary_id",
});
