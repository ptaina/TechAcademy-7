import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class ProductModel extends Model {
  id!: number;
  name!: string;
  description!: string;
  price!: number;
  stock_quantity!: number;
  measurement_unit!: string;
  unit_details?: string; // nem  toda unidadde precisa de detalhe
  image_url!: string;
  categoryId!: number;
  producerId!: number;
}

ProductModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Preço por unidade de medida (preço por caixa, por kg)",
    },
    stock_quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Quantidade em estoque, na mesma unidade de medida do preço",
    },
    measurement_unit: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Unidade de medida principal (cx, kg, dz, sc)",
    },
    unit_details: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Descrição complementar da unidade ('Caixa com 12 unidades')",
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
  }
);

export default ProductModel;
