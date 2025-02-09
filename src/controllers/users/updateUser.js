import { request, response } from "express";
import db from "../../connector";

async function updateUser(req = request, res = response) {
  try {
    const { id } = req.params;
    const { fullname, address, phoneNumber, role } = req.body;

    const roleUpper = role.toUpperCase();
    // cek apakah user ada
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

    const updateUser = await db.users.update({
      where: {
        id: parseInt(id),
      },
      data: {
        fullname,
        address,
        phoneNumber,
        role: roleUpper,
        updatedAt: new Date(),
      },
    });
    res.status(200).json({
      status: "success",
      msg: `User updated successfully`,
      data: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      msg: error.message,
    });
  }
}

export { updateUser };
