import ProductModel from "./ProductModel";
import CategoryModel from "./CategoryModel";
import ProducerModel from "./ProducerModel";

export const associateModels = () => {
  CategoryModel.hasMany(ProductModel, {
    foreignKey: "categoryId",
    as: "products",
    onDelete: "CASCADE",
  });

  ProductModel.belongsTo(CategoryModel, {
    foreignKey: "categoryId",
    as: "category",
  });

  ProducerModel.hasMany(ProductModel, {
    foreignKey: "producerId",
    as: "products",
  });

  ProductModel.belongsTo(ProducerModel, {
    foreignKey: "producerId",
    as: "producer",
  });
};
