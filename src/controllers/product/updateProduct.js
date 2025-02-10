import { request, response } from "express";
import db from "../../connector";

async function updateProduct(req = request, res = response) {
  try {
    const { productId } = req.params;
    const { name, description, stock, categoryName, prices } = req.body;

    // cek apakah product ada
    const findProduct = await db.products.findUnique({
      where: {
        id: parseInt(productId),
      },
    });

    if (!findProduct) {
      return res.status(404).json({
        status: "failed",
        msg: `Product with ID ${productId} not found`,
      });
    }

    // cari categoryId berdasarkan nama kategori
    let category = await db.categories.findUnique({
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

    // update product dengan categoryId yang ditemukan
    const updateProduct = await db.products.update({
      where: {
        id: parseInt(productId),
      },
      data: {
        name,
        description,
        stock,
        categoryId: category.id,
        updatedAt: new Date(),
      },
    });

    // update harga product berdasarkan role jika ada prices
    if (prices && typeof prices === "object") {
      await Promise.all(
        Object.entries(prices).map(async ([role, price]) => {
          await db.userPrice.upsert({
            where: {
              productId_role: {
                productId: updateProduct.id,
                role: role.toUpperCase(),
              },
            },
            update: {
              price,
            },
            create: {
              productId: updateProduct.id,
              role: role.toUpperCase(),
              price,
            },
          });
        })
      );
    }
    res.status(200).json({
      status: "success",
      msg: `Update product with ID ${productId} success`,
      data: updateProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      msg: error.message,
    });
  }
}

export { updateProduct };
