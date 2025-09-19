import express from "express";
import { loginProducer } from "../controllers/loginController";

const router = express.Router();

router.post("/login", loginProducer);

export default router;
