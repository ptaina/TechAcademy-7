import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class CategoryModel extends Model {
  id!: number;
  name!: string;
}

CategoryModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "categories",
    timestamps: false,
  }
);

export default CategoryModel;
