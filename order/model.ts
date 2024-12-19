import {
  ARRAY,
  BOOLEAN,
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
  declare deadLine: CreationOptional<string>;
  declare advanceAmount: CreationOptional<boolean>;
  declare payment_terms: CreationOptional<string>;
  declare approved_by_sales: CreationOptional<boolean>;
  declare approved_by_accounts: CreationOptional<boolean>;
  declare approved_by_planning: CreationOptional<boolean>;
  declare approved_by_customer: CreationOptional<boolean>;
  declare approved_by_stores: CreationOptional<boolean>;

  declare order_status: CreationOptional<string[]>;
  declare product_status: CreationOptional<string[]>;
  declare isActive: CreationOptional<boolean>;
  declare price: CreationOptional<number>;

  declare headSize: CreationOptional<number>;
  declare motorType: CreationOptional<string>;
  declare current: CreationOptional<string>;
  declare diameter: CreationOptional<string>;
  declare pannelType: CreationOptional<string>;
  declare spd: CreationOptional<string>;
  declare data: CreationOptional<string>;
  declare warranty: CreationOptional<string>;
  declare transportation: CreationOptional<string>;
  declare sales_negotiation_status: CreationOptional<string>;
  declare stores_status: CreationOptional<string>;
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
    sales_negotiation_status: {
      type: STRING,
    },
    stores_status: {
      type: STRING,
    },
    discount: {
      type: DOUBLE,
    },
    remarks: {
      type: STRING,
    },
    advanceAmount: {
      type: BOOLEAN,
    },
    approved_by_accounts: {
      type: BOOLEAN,
    },
    approved_by_customer: {
      type: BOOLEAN,
    },
    approved_by_planning: {
      type: BOOLEAN,
    },
    approved_by_sales: {
      type: BOOLEAN,
    },
    approved_by_stores: {
      type: BOOLEAN,
    },
    deadLine: {
      type: STRING,
    },
    isActive: {
      type: BOOLEAN,
      defaultValue: true,
    },
    order_status: {
      type: ARRAY(STRING),
    },
    payment_terms: {
      type: STRING,
    },
    product_status: {
      type: ARRAY(STRING),
    },
    price: {
      type: DOUBLE,
    },
    data: {
      type: STRING,
    },
    diameter: {
      type: STRING,
    },
    current: {
      type: STRING,
    },
    headSize: {
      type: NUMBER,
    },
    motorType: {
      type: STRING,
    },
    pannelType: {
      type: STRING,
    },
    spd: {
      type: STRING,
    },
    transportation: {
      type: STRING,
    },
    warranty: {
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
