import { Router } from "express";
import { createProduct } from "../controllers/product/createProduct";
import { validateUser } from "../middleware/validateUser";
import { getProducts } from "../controllers/product/getProducts";
import { updateProduct } from "../controllers/product/updateProduct";
import { deleteProduct } from "../controllers/product/deleteProduct";

const productRoute = new Router();

// create product
productRoute.post("/api/create/product", validateUser, createProduct);

// get all product
productRoute.get("/api/products", validateUser, getProducts);

// update product
productRoute.put("/api/update/product/:productId", validateUser, updateProduct);

// delete product
productRoute.delete(
  "/api/delete/product/:productId",
  validateUser,
  deleteProduct
);

export default productRoute;
