import { request, response } from "express";
import db from "../../connector";

async function getUserById(req = request, res = response) {
  try {
    const { id } = req.params;

    const user = await db.users.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        fullname: true,
        address: true,
        phoneNumber: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(400).json({
        status: "failed",
        msg: `User with ID ${id} not found`,
      });
    }

    res.status(200).json({
      status: "success",
      msg: `Get user with ID ${id} success`,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      msg: error.message,
    });
  }
}

export { getUserById };
