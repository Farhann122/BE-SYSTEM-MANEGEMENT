import { request, response } from "express";
import db from "../../connector";

async function getOrderItemByUserId(req = request, res = response) {
  try {
    const { fullname } = req.body;

    // cari user berdasarkan fullname
    const findUser = await db.users.findUnique({
      where: {
        fullname,
      },
    });

    if (!findUser) {
      return res.status(400).json({
        status: "failed",
        msg: `User ${fullname} not found`,
      });
    }

    const orders = await db.orders.findMany({
      where: {
        userId: findUser.id,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!orders) {
      return res.status(400).json({
        status: "failed",
        msg: `Order with user ${fullname} not found`,
      });
    }

    res.status(200).json({
      status: "success",
      msg: `Get order with user ${fullname} successfully`,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      msg: error.message,
    });
  }
}

export { getOrderItemByUserId };
