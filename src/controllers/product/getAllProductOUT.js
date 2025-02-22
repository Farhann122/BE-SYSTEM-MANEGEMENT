import { request, response } from "express";
import db from "../../connector";

async function getAllProductOUT(req = request, res = response) {
  try {
    const stockOutChanges = await db.stockHistory.findMany({
      where: {
        oldStock: {
          gt: db.stockHistory.fields.newStock,
        },
      },
      select: {
        id: true,
        productId: true,
        oldStock: true,
        newStock: true,
        changeAt: true,
        product: {
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        changeAt: "desc",
      },
    });

    const formatChanges = stockOutChanges.map((change) => ({
      id: change.id,
      productId: change.productId,
      name: change.product.name,
      oldStock: change.oldStock,
      newStock: change.newStock,
      stockOut: change.oldStock - change.newStock,
      changeAt: change.changeAt,
      category: change.product.category.name,
    }));

    res.status(200).json({
      status: "success",
      msg: "All product stock out changes retrieved successfully",
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

export { getAllProductOUT };
