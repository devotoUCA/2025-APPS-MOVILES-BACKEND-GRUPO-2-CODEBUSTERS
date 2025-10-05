import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error fetching products" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, price, image, description } = req.body;
    const newProduct = await prisma.product.create({
      data: { title, price, image, description },
    });
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ error: "Error creating product" });
  }
};
