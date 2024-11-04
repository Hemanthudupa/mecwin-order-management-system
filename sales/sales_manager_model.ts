import {
  ARRAY,
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
import { User } from "../user/model";
import sequelize from "../database";

export class SalesManager extends Model<
  InferAttributes<SalesManager>,
  InferCreationAttributes<SalesManager>
> {
  declare id: CreationOptional<string>;
  declare userId: ForeignKey<User>;
  declare userName: CreationOptional<string>;
  declare employeeId: CreationOptional<string>;
  declare locations: CreationOptional<string[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

SalesManager.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    employeeId: {
      type: STRING,
      allowNull: false,
      unique: true,
    },
    locations: {
      type: ARRAY,
    },
    userName: {
      type: STRING,
    },
    userId: {
      type: UUID,
      references: {
        model: User,
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
    modelName: "salesmanager",
    tableName: "salesmanager",
    timestamps: true,
  }
);
