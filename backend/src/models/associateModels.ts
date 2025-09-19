import ProductModel from "./ProductModel";
import CategoryModel from "./CategoryModel";

export const associateModels = () => {
  CategoryModel.hasMany(ProductModel, {
    foreignKey: "categoryId",
    as: "products",
  });

  ProductModel.belongsTo(CategoryModel, {
    foreignKey: "categoryId",
    as: "category", // tá no singular, pois é apenas uma
  });
};
