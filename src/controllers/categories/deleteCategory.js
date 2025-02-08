import { response, request } from "express";
import db from "../../connector";

async function deleteCategory(req = request, res = response) {
  try {
    const { id } = req.params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return res.status(400).json({
        status: "failed",
        msg: "Invalid category ID",
      });
    }

    const findCategory = await db.categories.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!findCategory) {
      return res.status(404).json({
        status: "failed",
        msg: `Category with ID ${id} not found`,
      });
    }

    const response = await db.categories.delete({
      where: {
        id: categoryId,
      },
    });
    res.status(200).json({
      status: "success",
      msg: `Delete category with ID ${id} success`,
      category: response.name,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      msg: error.message,
    });
  }
}

export { deleteCategory };
