import { Router } from "express";
import { createProduct } from "../controllers/product/createProduct";
import { validateUser } from "../middleware/validateUser";
import { getProducts } from "../controllers/product/getProducts";
import { updateProduct } from "../controllers/product/updateProduct";
import { deleteProduct } from "../controllers/product/deleteProduct";
import { getAllProductIN } from "../controllers/product/getAllProductIN";
import { getProductINById } from "../controllers/product/getProductINbyId";
import { getAllProductOUT } from "../controllers/product/getAllProductOUT";
import { getProductOUTById } from "../controllers/product/getProductOUTById";

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

// get all product in
productRoute.get("/api/products/in", validateUser, getAllProductIN);

// get product in by id
productRoute.get("/api/product/in/:productId", validateUser, getProductINById);

// get all product out
productRoute.get("/api/products/out", validateUser, getAllProductOUT);

// get product out by id
productRoute.get(
  "/api/product/out/:productId",
  validateUser,
  getProductOUTById
);

export default productRoute;
