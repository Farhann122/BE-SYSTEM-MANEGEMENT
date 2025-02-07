import { request, response } from "express";
import bcrypt from "bcryptjs";
import db from "../../connector";

async function register(req = request, res = response) {
  const {
    username,
    email,
    password,
    confirmPassword,
    address,
    phoneNumber,
    role,
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({
      msg: "passwords do not match",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  try {
    // validasi username dan email
    const existUsernameAndEmail = await db.admin.findFirst({
      where: {
        username: username,
        email: email,
      },
    });

    if (existUsernameAndEmail) {
      return res.status(400).json({
        status: "failed",
        msg: "username or email already exist",
      });
    }

    const response = await db.admin.create({
      data: {
        username,
        email,
        password: hashPassword,
        address,
        phoneNumber,
        role,
      },
    });
    res.status(200).json({
      status: "success",
      msg: "Register successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      msg: error.message,
    });
  }
}

export { register };
