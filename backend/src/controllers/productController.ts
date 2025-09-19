import { Request, Response } from "express";
import ProductModel from "../models/ProductModel";
import CategoryModel from "../models/CategoryModel";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      stock_quantity,
      measurement_unit,
      unit_details,
      image_url,
      categoryId,
    } = req.body;

    if (
      !name ||
      !price ||
      !stock_quantity ||
      !measurement_unit ||
      !image_url ||
      !categoryId
    ) {
      return res
        .status(400)
        .json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
    }

    const newProduct = await ProductModel.create({
      name,
      description,
      price,
      stock_quantity,
      measurement_unit,
      unit_details,
      image_url,
      categoryId,
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.findAll({
      include: { model: CategoryModel, as: "category" },
    });
    return res.status(200).json(products);
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findByPk(id, {
      include: { model: CategoryModel, as: "category" },
    });

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findByPk(id);

    if (!product) {
      return res.status(44).json({ error: "Produto não encontrado." });
    }

    await product.update(req.body);

    return res.status(200).json(product);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const destroyProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    await product.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};
