import express from "express";
import {
  createProducer,
  getProducerById,
  updateProducer,
  updateProducerPassword,
  destroyProducerById,
} from "../controllers/producerController";

import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/producers", createProducer);
router.get("/producers/:id", authMiddleware, getProducerById);
router.put("/producers/:id", authMiddleware, updateProducer);
router.put("/producers/:id/password", authMiddleware, updateProducerPassword);
router.delete("/producers/:id", authMiddleware, destroyProducerById);

export default router;
