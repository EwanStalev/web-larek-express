import { celebrate, Joi, Segments } from "celebrate";
import { RequestHandler } from "express";

export const validateOrderRequest: RequestHandler = celebrate({
  [Segments.BODY]: Joi.object()
    .keys({
      payment: Joi.string().valid("card", "online").required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      address: Joi.string().required(),
      total: Joi.number().min(0).required(),
      items: Joi.array()
        .items(Joi.string().hex().length(24))
        .min(1)
        .required(),
    })
    .required(),
});

export const validateProductRequest: RequestHandler = celebrate({
  [Segments.BODY]: Joi.object()
    .keys({
      title: Joi.string().min(2).max(30).required(),
      category: Joi.string().required(),
      price: Joi.number().min(0).allow(null),
      description: Joi.string().optional(),
      image: Joi.object({
        fileName: Joi.string().required(),
        originalName: Joi.string().required(),
      })
        .required()
        .unknown(false),
    })
    .required(),
});
