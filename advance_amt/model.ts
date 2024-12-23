import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import sequelize from "../database";

export class AdvanceAmt extends Model<
  InferAttributes<AdvanceAmt>,
  InferCreationAttributes<AdvanceAmt>
> {
  declare id: CreationOptional<string>;
  declare advanceAmt: CreationOptional<string>;
}

AdvanceAmt.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    advanceAmt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    modelName: "AdvanceAmt",
    tableName: "advance_amt",
    timestamps: false,
    sequelize: sequelize,
  }
);
