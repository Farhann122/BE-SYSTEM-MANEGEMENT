import { request, response } from "express";
import db from "../../connector";

async function deleteUser(req = request, res = response) {
  try {
    const { id } = req.params;

    const findUser = await db.users.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!findUser) {
      return res.status(400).json({
        status: "failed",
        msg: `User with ID ${id} not found`,
      });
    }

    const response = await db.users.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json({
      status: "success",
      msg: `Delete user with ID ${id} success`,
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      msg: error.message,
    });
  }
}

export { deleteUser };
