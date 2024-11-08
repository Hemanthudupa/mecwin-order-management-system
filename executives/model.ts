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
import { Manager } from "../managers/model";
import { User } from "../user/model";
import sequelize from "../database";

export class Executive extends Model<
  InferAttributes<Executive>,
  InferCreationAttributes<Executive>
> {
  declare id: CreationOptional<string>;
  declare managerId: ForeignKey<Manager>;
  declare location: CreationOptional<string>;
  declare userId: ForeignKey<User>;
  declare userName: CreationOptional<string>;
  declare employeeId: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Executive.init(
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
    managerId: {
      type: UUID,
      references: {
        model: Manager,
        key: "id",
      },
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
    sequelize: sequelize,
    modelName: "executives",
    tableName: "executives",
    timestamps: true,
  }
);

Executive.belongsTo(User);
Executive.belongsTo(Manager);
