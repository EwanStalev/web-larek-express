import { Router } from "express";
import { listProducts, addProduct } from "../controllers/products";
import { validateProductRequest } from "../middlewares/validations";

const router = Router();

router.get("/product", listProducts);
router.post("/product", validateProductRequest, addProduct);

export default router;
