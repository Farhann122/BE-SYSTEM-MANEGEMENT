import { request, response } from "express";
import db from "../../connector";

async function getProducts(req = request, res = response) {
  try {
    const response = await db.products.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        userPrice: {
          select: {
            id: true,
            productId: true,
            role: true,
            price: true,
          },
        },
      },
    });
    res.status(200).json({
      status: "success",
      msg: "Get all products successfully",
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

export { getProducts };
