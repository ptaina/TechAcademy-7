import { Request, Response } from "express";
import ProducerModel from "../models/ProducerModel";
import { generateToken } from "../utils/jwt";

export const loginProducer = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    const producer = await ProducerModel.findOne({ where: { email } });
    if (!producer) {
      return res.status(401).json({ error: "Email ou senha inválidos." });
    }

    const isPasswordValid = await producer.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email ou senha inválidos." });
    }

    const token = generateToken({ id: producer.id, name: producer.name });

    const { password: _, ...producerData } = producer.get();
    return res.status(200).json({
      message: "Login realizado com sucesso!",
      producer: producerData,
      token: token,
    });
  } catch (error) {
    console.error("Erro no login do produtor:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};
