import { Router } from "express";
import { register } from "../controllers/auth/registerAdmin";
import { login } from "../controllers/auth/loginAdmin";
import { validateUser } from "../middleware/validateUser";
import { getUsers } from "../controllers/users/getUsers";
import { createUser } from "../controllers/users/createUser";
import { getUserById } from "../controllers/users/getUserById";
import { updateUser } from "../controllers/users/updateUser";
import { deleteUser } from "../controllers/users/deleteUser";
import { updateAdmin } from "../controllers/auth/updateAdmin";

const authRoute = new Router();

// create user (register) *Admin
authRoute.post("/api/register", register);

// login *Admin
authRoute.post("/api/login", login);

// update *Admin
authRoute.put("/api/update", validateUser, updateAdmin);

// create user (register) *User
authRoute.post("/api/create/user", validateUser, createUser);

// get all users
authRoute.get("/api/users", validateUser, getUsers);

// get user by id
authRoute.get("/api/users/:id", validateUser, getUserById);

// update user
authRoute.put("/api/update/user/:id", validateUser, updateUser);

// delete user
authRoute.delete("/api/delete/user/:id", validateUser, deleteUser);

export default authRoute;
