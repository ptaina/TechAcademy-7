import { Request, Response } from "express";
import { Op } from "sequelize";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import ProducerModel from "../models/ProducerModel";

export const createProducer = async (req: Request, res: Response) => {
  try {
    const { name, establishmentName, email, phone, cpf, address, password } =
      req.body;

    if (!name || !email || !phone || !cpf || !address || !password) {
      return res
        .status(400)
        .json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
    }
    if (!cpfValidator.isValid(cpf)) {
      return res.status(400).json({ error: "Formato de CPF inválido." });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número.",
      });
    }
    const existingProducer = await ProducerModel.findOne({
      where: { [Op.or]: [{ email }, { cpf }] },
    });
    if (existingProducer) {
      return res.status(400).json({ error: "Email ou CPF já cadastrado." });
    }

    const producer = await ProducerModel.create({
      name,
      establishmentName,
      email,
      phone,
      cpf,
      address,
      password,
    });
    const { password: _, ...producerData } = producer.get();
    return res.status(201).json({
      message: "Produtor cadastrado com sucesso!",
      producer: producerData,
    });
  } catch (error) {
    console.error("Erro ao criar produtor:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getProducerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const producer = await ProducerModel.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!producer) {
      return res.status(404).json({ error: "Produtor não encontrado." });
    }
    return res.status(200).json(producer);
  } catch (error) {
    console.error("Erro ao buscar produtor:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const updateProducer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, establishmentName, phone, address, currentPassword } =
      req.body;

    if (!currentPassword) {
      return res.status(401).json({
        error: "Senha atual é obrigatória para realizar alterações no perfil.",
      });
    }

    const producer = await ProducerModel.findByPk(id);
    if (!producer) {
      return res.status(404).json({ error: "Produtor não encontrado." });
    }

    const isPasswordValid = await producer.validatePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Senha atual incorreta." });
    }

    const updates: {
      name?: string;
      establishmentName?: string;
      phone?: string;
      address?: string;
    } = {};
    if (name) updates.name = name;
    if (establishmentName != null)
      updates.establishmentName = establishmentName;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;

    await producer.update(updates);
    const { password: _, ...updatedProducer } = producer.get();
    return res.status(200).json({
      message: "Perfil atualizado com sucesso!",
      producer: updatedProducer,
    });
  } catch (error) {
    console.error("Erro ao atualizar produtor:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const updateProducerPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        error: "Todos os campos são obrigatórios para alterar a senha.",
      });
    }
    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ error: "A nova senha e a confirmação não conferem." });
    }

    const producer = await ProducerModel.findByPk(id);
    if (!producer) {
      return res.status(404).json({ error: "Produtor não encontrado." });
    }

    const isPasswordValid = await producer.validatePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Senha atual incorreta." });
    }

    producer.password = newPassword;
    await producer.save();

    return res.status(200).json({ message: "Senha alterada com sucesso!" });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const destroyProducerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const producer = await ProducerModel.findByPk(id);
    if (!producer) {
      return res.status(404).json({ error: "Produtor não encontrado." });
    }
    await producer.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar produtor:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};
