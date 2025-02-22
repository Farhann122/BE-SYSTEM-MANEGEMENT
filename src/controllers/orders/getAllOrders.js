import { request, response } from "express";
import db from "../../connector";

async function getAllOrders(req = request, res = response) {
  try {
    const response = await db.orders.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            fullname: true,
            address: true,
            phoneNumber: true,
            role: true,
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(200).json({
      status: "success",
      msg: "Get all orders successfully",
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      msg: error.message,
    });
  }
}

export { getAllOrders };
