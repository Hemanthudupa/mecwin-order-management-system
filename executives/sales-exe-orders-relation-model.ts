import {
  BOOLEAN,
  CreationOptional,
  DATE,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  UUID,
  UUIDV4,
} from "sequelize";
import { Executive } from "./model";
import { Order } from "../order/model";
import sequelize from "../database";

export class SalesExce_Order_Relation extends Model<
  InferAttributes<SalesExce_Order_Relation>,
  InferCreationAttributes<SalesExce_Order_Relation>
> {
  declare id: CreationOptional<string>;
  declare salesExecutivesId: ForeignKey<Executive>;
  declare orderId: ForeignKey<Order>;
  declare isActive: CreationOptional<boolean>;
  declare isUnderProcess: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

SalesExce_Order_Relation.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    salesExecutivesId: {
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
    createdAt: {
      type: DATE,
    },
    updatedAt: {
      type: DATE,
    },
  },
  {
    modelName: "sales-exe-orders-relation-model",
    tableName: "sales-exe-orders-relation-model",
    timestamps: true,
    sequelize,
  }
);

SalesExce_Order_Relation.belongsTo(Executive, {
  foreignKey: "id",
  as: "salesExecutivesId",
});
