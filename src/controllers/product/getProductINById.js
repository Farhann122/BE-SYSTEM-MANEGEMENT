import { request, response } from "express";
import db from "../../connector";

async function getProductINById(req = request, res = response) {
  try {
    const { productId } = req.params;

    const product = await db.products.findUnique({
      where: {
        id: parseInt(productId),
      },
      select: {
        id: true,
        name: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        status: "failed",
        msg: `Product with ID ${productId} not found`,
      });
    }

    // ambil riwayat perubahan stock berdasarkan productId
    const stockChanges = await db.stockHistory.findMany({
      where: {
        productId: parseInt(productId),
      },
      orderBy: {
        changeAt: "desc",
      },
      select: {
        oldStock: true,
        newStock: true,
        changeAt: true,
      },
    });

    if (stockChanges.length === 0) {
      return res.status(200).json({
        status: "success",
        msg: `Product with ID ${productId} has no stock changes`,
        product: {
          id: product.id,
          name: product.name,
          category: product.category,
        },
        data: [],
      });
    }

    const formattedChanges = stockChanges.map((history) => ({
      oldStock: history.oldStock,
      newStock: history.newStock,
      calcStock: history.newStock - history.oldStock,
      changeAt: history.changeAt,
    }));

    return res.status(200).json({
      status: "success",
      msg: `Stock history of product with ID ${productId} retrieved successfully`,
      product: {
        id: product.id,
        name: product.name,
        category: product.category,
      },
      data: formattedChanges,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      msg: error.message,
    });
  }
}

export { getProductINById };
