import { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";
import Product from "../models/product";
import { BadRequestError } from "../errors/bad-request-error";
import { ConflictError } from "../errors/conflict-error";

export const listProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await Product.find({});
    return res.send({ items: products, total: products.length });
  } catch (err) {
    return next(err);
  }
};

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).send(product);
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      return next(new BadRequestError("Validation error while creating a product"));
    }

    if (err instanceof Error && err.message.includes("E11000")) {
      return next(new ConflictError("A product with this title already exists"));
    }

    return next(err);
  }
};
