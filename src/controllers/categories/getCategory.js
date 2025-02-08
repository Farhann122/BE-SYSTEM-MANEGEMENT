import { response, request } from "express";
import db from "../../connector";

async function getCategory(req = request, res = response) {
  try {
    const response = await db.categories.findMany({
      select: {
        id: true,
        name: true,
        product: true,
      },
    });
    res.status(200).json({
      status: "success",
      msg: "Get all categories success",
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

export { getCategory };
