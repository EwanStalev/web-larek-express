import { Request, Response, NextFunction } from "express";
import { faker } from "@faker-js/faker";
import Product from "../models/product";
import { BadRequestError } from "../errors/bad-request-error";

const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { total, items } = req.body;

    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      return next(new BadRequestError("Some products were not found"));
    }

    if (products.some((product) => product.price === null)) {
      return next(new BadRequestError("Some products have no price set"));
    }

    const calculatedTotal = products.reduce(
      (sum, product) => sum + (product.price || 0),
      0,
    );

    if (Math.abs(calculatedTotal - total) > 0.01) {
      return next(new BadRequestError("Order total mismatch"));
    }

    const orderId = faker.string.uuid();

    return res.status(200).json({
      id: orderId,
      total: calculatedTotal,
    });
  } catch (err) {
    return next(err);
  }
};

export default placeOrder;
