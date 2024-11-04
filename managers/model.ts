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

export class Manager extends Model<
  InferAttributes<Manager>,
  InferCreationAttributes<Manager>
> {
  declare id: CreationOptional<string>;
  declare employeeId: CreationOptional<string>;
  declare work_locations: CreationOptional<string[]>;
  declare userName: CreationOptional<string>;
  declare userId: ForeignKey<User>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Manager.init(
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
    work_locations: {
      type: ARRAY(STRING),
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
    modelName: "managers",
    tableName: "managers",
    timestamps: true,
    sequelize: sequelize,
  }
);
