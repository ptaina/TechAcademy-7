import express from "express";
import {
  createProducer,
  getProducerById,
  updateProducer,
  updateProducerPassword,
  destroyProducerById,
} from "../controllers/producerController";

const router = express.Router();

router.post("/producers", createProducer);
router.get("/producers/:id", getProducerById);
router.put("/producers/:id", updateProducer);
router.put("/producers/:id/password", updateProducerPassword);
router.delete("/producers/:id", destroyProducerById);

export default router;
