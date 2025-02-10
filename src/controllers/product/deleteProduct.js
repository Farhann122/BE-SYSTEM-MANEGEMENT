import { request, response } from "express";
import db from "../../connector";

async function deleteProduct(req = request, res = response) {
  try {
    const { productId } = req.params;

    // cek apakah product ada
    const product = await db.products.findUnique({
      where: {
        id: parseInt(productId),
      },
    });

    if (!product) {
      return res.status(404).json({
        status: "failed",
        msg: `Product with ID ${productId} not found`,
      });
    }

    // hapus semua harga dari userPrice
    await db.userPrice.deleteMany({
      where: {
        productId: parseInt(productId),
      },
    });

    // hapus product
    await db.products.delete({
      where: {
        id: parseInt(productId),
      },
    });

    res.status(200).json({
      status: "success",
      msg: `Delete product with ID ${productId} success`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      msg: error.message,
    });
  }
}

export { deleteProduct };
