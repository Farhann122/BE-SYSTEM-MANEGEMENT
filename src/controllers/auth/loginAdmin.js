import { request, response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../../connector";

async function login(req = request, res = response) {
  try {
    const { email, password } = req.body;

    const findUser = await db.admin.findUnique({
      where: {
        email: email,
      },
    });

    // validasi email user apakah sesuai ketika register
    if (!findUser) {
      return res.status(400).json({
        status: "failed",
        msg: "Email not found",
      });
    }

    // validasi password user apakah sesuai ketika register
    const checkPassword = await bcrypt.compare(password, findUser.password);
    if (!checkPassword) {
      return res.status(400).json({
        status: "failed",
        msg: "Password not match",
      });
    }

    const key = process.env.SECRET_KEY;
    const token = jwt.sign({ userId: findUser.id }, key, { expiresIn: "1d" });

    res.status(200).json({
      status: "success",
      msg: "Login successfully",
      token: token,
      role: findUser.role,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      msg: error.message,
    });
  }
}

export { login };
