import { Router } from "express";
import { createCategory } from "../controllers/categories/createCategory";
import { getCategory } from "../controllers/categories/getCategory";
import { deleteCategory } from "../controllers/categories/deleteCategory";
import { validateUser } from "../middleware/validateUser";
import { updateCategory } from "../controllers/categories/updateCategory";

const categoryRoute = new Router();

// create category
categoryRoute.post("/api/create/category", validateUser, createCategory);

// get all category
categoryRoute.get("/api/category", validateUser, getCategory);

// update category
categoryRoute.put("/api/update/category/:id", validateUser, updateCategory);

// delete category
categoryRoute.delete("/api/delete/category/:id", validateUser, deleteCategory);

export default categoryRoute;
