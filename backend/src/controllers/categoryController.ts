import { Request, Response } from "express";
import CategoryModel from "../models/CategoryModel";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ error: "O nome da categoria é obrigatório." });
    }
    const newCategory = await CategoryModel.create({ name });
    return res.status(201).json(newCategory);
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.findAll();
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Erro ao listar categorias:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }
    return res.status(200).json(category);
  } catch (error) {
    console.error("Erro ao buscar categoria:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await CategoryModel.findByPk(id);

    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }
    if (!name) {
      return res
        .status(400)
        .json({ error: "O nome da categoria é obrigatório." });
    }
    await category.update({ name });
    return res.status(200).json(category);
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const destroyCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findByPk(id);

    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }
    await category.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};
