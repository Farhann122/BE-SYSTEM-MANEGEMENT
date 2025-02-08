import { response, request } from "express";
import db from "../../connector";

async function updateCategory(req = request, res = response) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // validasi input
    if (!name) {
      return res.status(400).json({
        status: "failed",
        msg: "Category name is required",
      });
    }

    // validasi apakah category ada
    const findCategory = await db.categories.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!findCategory) {
      return res.status(400).json({
        status: "failed",
        msg: `Category with ID ${id} not found`,
      });
    }

    const response = await db.categories.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    });
    res.status(200).json({
      status: "success",
      msg: `Update category with ID ${id} success`,
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      msg: error.message,
    });
  }
}

export { updateCategory };
