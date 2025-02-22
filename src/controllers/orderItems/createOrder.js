import { request, response } from "express";
import db from "../../connector";

async function createOrder(req = request, res = response) {
  try {
    const { fullname, quantity } = req.body;
    const { productId } = req.params;

    // cari user berdasarkan fullname yang diinput
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

    // cek apakah product ada di database
    const product = await db.products.findUnique({
      where: {
        id: parseInt(productId),
      },
      include: {
        userPrice: true,
      },
    });

    if (!product) {
      return res.status(400).json({
        status: "failed",
        msg: `Product with ID ${productId} not found`,
      });
    }

    // cek apakah stock product mencukupi
    if (product.stock < quantity) {
      return res.status(400).json({
        status: "failed",
        msg: `Stock product ${product.name} not enough`,
      });
    }

    // ambil harga berdasarkan role user
    const userPrices = product.userPrice.find(
      (price) => price.role === findUser.role
    );

    if (!userPrices) {
      return res.status(400).json({
        status: "failed",
        msg: `User role ${findUser.role} not found in product ${product.name}`,
      });
    }

    const subTotal = userPrices.price * quantity;

    // cek apakah user sudah memiliki order
    let order = await db.orders.findFirst({
      where: {
        userId: findUser.id,
      },
    });

    if (!order) {
      // jika tidak ada order,buat order baru
      order = await db.orders.create({
        data: {
          userId: findUser.id,
          totalPrice: subTotal,
        },
      });
    } else {
      // jika ada order, update total price
      await db.orders.update({
        where: {
          id: order.id,
        },
        data: {
          totalPrice: {
            increment: subTotal,
          },
        },
      });
    }

    // tambahkan product ke orderItems
    const orderItems = await db.orderItems.create({
      data: {
        orderId: order.id,
        productId: product.id,
        quantity,
        subTotal,
      },
    });

    // kurangi stock product
    await db.products.update({
      where: {
        id: product.id,
      },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });

    // catatkan riwayat stock
    await db.stockHistory.create({
      data: {
        productId: product.id,
        oldStock: product.stock,
        newStock: product.stock - quantity,
      },
    });

    res.status(201).json({
      status: "success",
      msg: "Order created successfully",
      order,
      orderItems,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      msg: error.message,
    });
  }
}

export { createOrder };
