import { Router } from "express";
import { createOrder } from "../controllers/orderItems/createOrder";
import { getOrderItemByUserId } from "../controllers/orderItems/getOrderItemByUserId";
import { getAllOrders } from "../controllers/orders/getAllOrders";
import { validateUser } from "../middleware/validateUser";

const orderRoute = new Router();

// create order
orderRoute.post("/api/create/order/:productId", validateUser, createOrder);

// get order by userId (fullname)
orderRoute.get("/api/order/user", validateUser, getOrderItemByUserId);

// get all order
orderRoute.get("/api/orders", validateUser, getAllOrders);

export default orderRoute;
