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
import { SalesManager } from "./sales_manager_model";
import sequelize from "../database";

export class SalesExcicutive extends Model<
  InferAttributes<SalesExcicutive>,
  InferCreationAttributes<SalesExcicutive>
> {
  declare id: CreationOptional<string>;
  declare employeeId: CreationOptional<string>;
  declare salesManagerId: ForeignKey<SalesManager>;
  declare location: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

SalesExcicutive.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    salesManagerId: {
      type: UUID,
      references: {
        model: SalesManager,
        key: "id",
      },
    },
    location: {
      type: STRING,
    },
    employeeId: {
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
    sequelize: sequelize,
    modelName: "salesexcicutive",
    tableName: "salesexcicutive",
    timestamps: true,
  }
);
