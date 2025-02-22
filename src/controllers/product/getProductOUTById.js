import { request, response } from "express";
import db from "../../connector";

async function getProductOUTById(req = request, res = response) {
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

    // ambil riwayat perubahan stock keluar berdasarkan productId
    const stockOutChanges = await db.stockHistory.findMany({
      where: {
        productId: parseInt(productId),
        oldStock: {
          gt: db.stockHistory.fields.newStock,
        },
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

    if (stockOutChanges.length === 0) {
      return res.status(200).json({
        status: "success",
        msg: `Product with ID ${productId} has no stock out history`,
        product: {
          id: product.id,
          name: product.name,
          category: product.category,
        },
        data: [],
      });
    }

    const formatChanges = stockOutChanges.map((history) => ({
      oldStock: history.oldStock,
      newStock: history.newStock,
      stockOut: history.oldStock - history.newStock,
      changeAt: history.changeAt,
    }));

    return res.status(200).json({
      status: "success",
      msg: `Product with ID ${productId} has stock out history`,
      product: {
        id: product.id,
        name: product.name,
        category: product.category,
      },
      data: formatChanges,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      msg: error.message,
    });
  }
}

export { getProductOUTById };
