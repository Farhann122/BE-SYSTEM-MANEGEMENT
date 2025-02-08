import { request, response } from "express";
import db from "../../connector";

async function createCategory(req = request, res = response) {
  try {
    const { name } = req.body;

    // validasi input
    if (!name) {
      return res.status(400).json({
        status: "failed",
        msg: "Category name is required",
      });
    }

    // cek apakah category ada
    const existCategory = await db.categories.findFirst({
      where: {
        name: name,
      },
    });

    if (existCategory) {
      return res.status(400).json({
        status: "failed",
        msg: "Category already exist",
      });
    }

    const response = await db.categories.create({
      data: {
        name,
      },
    });
    res.status(200).json({
      status: "success",
      msg: "Create category success",
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

export { createCategory };
