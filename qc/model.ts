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

export class Qc extends Model<
  InferAttributes<Qc>,
  InferCreationAttributes<Qc>
> {
  declare id: CreationOptional<string>;
  declare employeeId: CreationOptional<string>;
  declare location: CreationOptional<string>;
  declare userName: CreationOptional<string>;
  declare userId: ForeignKey<User>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Qc.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    employeeId: {
      type: STRING,
      unique: true,
      allowNull: false,
    },
    userId: {
      type: UUID,
      references: {
        model: User,
        key: "id",
      },
    },
    location: {
      type: STRING,
    },
    userName: {
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
    modelName: "qc",
    tableName: "qc",
    timestamps: true,
    sequelize: sequelize,
  }
);
