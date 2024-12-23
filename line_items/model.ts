import {
  BOOLEAN,
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
import sequelize from "../database";
import { Order } from "../order/model";

export class LineItems extends Model<
  InferAttributes<LineItems>,
  InferCreationAttributes<LineItems>
> {
  declare id: CreationOptional<string>;
  declare orderId: ForeignKey<Order>;
  declare uom: CreationOptional<string>;
  declare price: CreationOptional<number>;
  declare headSize: CreationOptional<string>;
  declare motor_type: CreationOptional<string>;
  declare current: CreationOptional<string>;
  declare diameter: CreationOptional<string>;
  declare pannel_type: CreationOptional<string>;
  declare spd: CreationOptional<boolean>;
  declare data: CreationOptional<boolean>;
  declare warranty: CreationOptional<boolean>;
  declare transportation: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

LineItems.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    createdAt: {
      type: DATE,
    },
    updatedAt: {
      type: DATE,
    },
    spd: {
      type: BOOLEAN,
    },
    data: {
      type: BOOLEAN,
    },
    warranty: {
      type: BOOLEAN,
    },
    transportation: {
      type: BOOLEAN,
    },
    current: { type: STRING },
    diameter: { type: STRING },
    headSize: { type: STRING },
    motor_type: { type: STRING },
    pannel_type: { type: STRING },
    price: { type: STRING },
    uom: { type: STRING },
    orderId: {
      type: UUID,
      references: {
        model: Order,
        key: "id",
      },
    },
  },
  {
    modelName: "lineItems",
    tableName: "line_items",
    sequelize: sequelize,
    timestamps: true,
  }
);
