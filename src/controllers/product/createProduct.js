import { request, response } from "express";
import db from "../../connector";

async function createProduct(req = request, res = response) {
  try {
    const { categoryName, name, description, stock, prices } = req.body;

    const category = await db.categories.findFirst({
      where: {
        name: categoryName,
      },
    });

    if (!category) {
      return res.status(400).json({
        status: "failed",
        msg: `Category ${categoryName} not found`,
      });
    }

    const product = await db.products.create({
      data: {
        name,
        description,
        stock,
        categoryId: category.id,
      },
    });

    const priceRole = Object.entries(prices).map(([role, price]) => ({
      productId: product.id,
      role: role.toUpperCase(),
      price: price,
    }));
    await db.userPrice.createMany({
      data: priceRole,
    });

    return res.status(201).json({
      status: "success",
      msg: "Product created successfully",
      product: product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      msg: error.message,
    });
  }
}

export { createProduct };
