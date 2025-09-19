import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  destroyProductById,
} from "../controllers/productController";

const router = express.Router();

router.post("/products", createProduct);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", destroyProductById);

export default router;
