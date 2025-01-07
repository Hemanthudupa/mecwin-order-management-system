import {
  BOOLEAN,
  CreationOptional,
  DATE,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  INTEGER,
  Model,
  STRING,
  UUID,
  UUIDV4,
} from "sequelize";
import { Executive } from "./model";
import { Order } from "../order/model";
import sequelize from "../database";

export class StoresExe_Order_Relation extends Model<
  InferAttributes<StoresExe_Order_Relation>,
  InferCreationAttributes<StoresExe_Order_Relation>
> {
  declare id: CreationOptional<string>;
  declare storesExecutivesId: ForeignKey<Executive>;
  declare orderId: ForeignKey<Order>;
  declare isActive: CreationOptional<boolean>;
  declare isUnderProcess: CreationOptional<boolean>;
  declare totalScanned: CreationOptional<number>;
  declare unit_unique_id: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

StoresExe_Order_Relation.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    storesExecutivesId: {
      type: UUID,
      references: {
        model: Executive,
        key: "id",
      },
    },
    orderId: {
      type: UUID,
      references: {
        model: Order,
        key: "id",
      },
    },
    isUnderProcess: {
      type: BOOLEAN,
      defaultValue: true,
    },
    isActive: {
      type: BOOLEAN,
      defaultValue: true,
    },
    totalScanned: {
      type: INTEGER,
      defaultValue: 0,
    },

    unit_unique_id: {
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
    modelName: "stores-exe-order-relation",
    tableName: "stores-exe-order-relation",
    timestamps: true,
    sequelize,
  }
);

StoresExe_Order_Relation.belongsTo(Executive, {
  foreignKey: "storesExecutivesId",
  as: "storesExecutives",
});

StoresExe_Order_Relation.belongsTo(Order, {
  foreignKey: "orderId",
  as: "orders",
});
