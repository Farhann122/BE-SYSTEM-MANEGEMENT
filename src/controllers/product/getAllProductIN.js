import { request, response } from "express";
import db from "../../connector";

async function getAllProductIN(req = request, res = response) {
  try {
    const stockChanges = await db.stockHistory.findMany({
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

    const formatChanges = stockChanges.map((change) => ({
      id: change.id,
      productId: change.productId,
      name: change.product.name,
      oldStock: change.oldStock,
      newStock: change.newStock,
      calcStock: change.newStock - change.oldStock,
      changeAt: change.changeAt,
      category: change.product.category.name,
    }));

    return res.status(200).json({
      status: "success",
      msg: "All product stock changes retrieved successfully",
      data: formatChanges,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      msg: error.message,
    });
  }
}

export { getAllProductIN };
