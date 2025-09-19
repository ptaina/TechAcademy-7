import { Request, Response } from "express";
import ProductModel from "../models/ProductModel";
import CategoryModel from "../models/CategoryModel";
import ProducerModel from "../models/ProducerModel";
import { JwtPayload } from "../types/jwtPayload";

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

    const loggedProducer = req.user as JwtPayload;

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
      producerId: loggedProducer.id,
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
      include: [
        { model: CategoryModel, as: "category" },
        {
          model: ProducerModel,
          as: "producer",
          attributes: { exclude: ["password", "cpf"] },
        },
      ],
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
      include: [
        { model: CategoryModel, as: "category" },
        {
          model: ProducerModel,
          as: "producer",
          attributes: { exclude: ["password", "cpf"] },
        },
      ],
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
    const loggedProducer = req.user as JwtPayload;

    const product = await ProductModel.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    if (product.producerId !== loggedProducer.id) {
      return res.status(403).json({
        error: "Acesso proibido. Você só pode editar seus próprios produtos.",
      });
    }

    await product.update(req.body);

    const updatedProduct = await ProductModel.findByPk(id, {
      include: [{ model: CategoryModel, as: "category" }],
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const destroyProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const loggedProducer = req.user as JwtPayload;

    const product = await ProductModel.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    if (product.producerId !== loggedProducer.id) {
      return res.status(403).json({
        error: "Acesso proibido. Você só pode deletar seus próprios produtos.",
      });
    }

    await product.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};
