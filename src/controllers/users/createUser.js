import { request, response } from "express";
import db from "../../connector";

async function createUser(req = request, res = response) {
  const { fullname, address, phoneNumber, role } = req.body;

  try {
    // validasi nama dan nomor telepon
    const existFullnameAndPhoneNumber = await db.users.findFirst({
      where: {
        fullname: fullname,
        phoneNumber: phoneNumber,
      },
    });

    if (existFullnameAndPhoneNumber) {
      return res.status(400).json({
        status: "failed",
        msg: "Fullname or phoneNumber already exist",
      });
    }

    const response = await db.users.create({
      data: {
        fullname,
        address,
        phoneNumber,
        role,
      },
    });
    res.status(200).json({
      status: "success",
      msg: "Create user success",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      msg: error.message,
    });
  }
}

export { createUser };
