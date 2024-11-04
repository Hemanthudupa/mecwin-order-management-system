import {
  CreationOptional,
  DATE,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NUMBER,
  UUID,
  UUIDV4,
} from "sequelize";
import { Distributor } from "../distributor/model";
import { Product } from "../products/model";
import sequelize from "../database";

export class Cart extends Model<
  InferAttributes<Cart>,
  InferCreationAttributes<Cart>
> {
  declare id: CreationOptional<string>;
  declare customerId: ForeignKey<Distributor>;
  declare productId: ForeignKey<Product>;
  declare quantity: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
Cart.init(
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
  },
  {
    sequelize: sequelize,
    modelName: "cart",
    tableName: "cart",
    timestamps: true,
  }
);
