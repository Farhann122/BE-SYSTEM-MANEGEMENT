import { Router } from "express";
import { createProduct } from "../controllers/product/createProduct";
import { validateUser } from "../middleware/validateUser";
import { getProducts } from "../controllers/product/getProducts";

const productRoute = new Router();

// create product
productRoute.post(
  "/api/create/product/:categoryId",
  validateUser,
  createProduct
);

// get all product
productRoute.get("/api/products", validateUser, getProducts);

export default productRoute;
