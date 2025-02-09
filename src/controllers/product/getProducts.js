import { request, response } from "express";
import db from "../../connector";

async function getProducts(req = request, res = response) {
  try {
    const response = await db.products.findMany({
      include: {
        userPrice: true,
      },
    });
    res.status(200).json({
      status: "success",
      msg: "Get all products success",
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
