import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  destroyProductById,
} from "../controllers/productController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/products", authMiddleware, createProduct);
router.get("/products", authMiddleware, getAllProducts);
router.get("/products/:id", authMiddleware, getProductById);
router.put("/products/:id", authMiddleware, updateProduct);
router.delete("/products/:id", authMiddleware, destroyProductById);

export default router;
