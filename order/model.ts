import {
  CreationOptional,
  DATE,
  DOUBLE,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NUMBER,
  STRING,
  UUID,
  UUIDV4,
} from "sequelize";
import { Distributor } from "../distributor/model";
import { Product } from "../products/model";
import sequelize from "../database";
import { Executive } from "../executives/model";

export class Order extends Model<
  InferAttributes<Order>,
  InferCreationAttributes<Order>
> {
  declare id: CreationOptional<string>;
  declare customerId: ForeignKey<Distributor>;
  declare productId: ForeignKey<Product>;
  declare quantity: CreationOptional<number>;
  declare shipping_Address: CreationOptional<string>;
  declare billing_Address: CreationOptional<string>;
  declare reason: CreationOptional<string>;
  declare discount: CreationOptional<number>;
  declare remarks: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Order.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    quantity: {
      type: NUMBER,
      defaultValue: 0,
    },
    customerId: {
      type: UUID,
      references: {
        model: Distributor,
        key: "id",
      },
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
    shipping_Address: {
      type: STRING,
    },
    billing_Address: {
      type: STRING,
    },
    reason: {
      type: STRING,
    },
    discount: {
      type: DOUBLE,
    },
    remarks: {
      type: STRING,
    },
  },
  {
    sequelize: sequelize,
    modelName: "orders",
    tableName: "orders",
    timestamps: true,
  }
);

Order.belongsTo(Distributor, {
  foreignKey: "customerId",
  as: "customers",
});
Order.belongsTo(Product, {
  foreignKey: "productId",
  as: "products",
});
