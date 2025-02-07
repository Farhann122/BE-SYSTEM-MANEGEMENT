import { request, response } from "express";
import bcrypt from "bcryptjs";
import db from "../../connector";

async function updateAdmin(req = request, res = response) {
  try {
    const userId = req.userId;
    const { username, email, password, confirmPassword, address, phoneNumber } =
      req.body;

    const user = await db.admin.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        msg: "User not found",
      });
    }

    if (email === "" || email === null) {
      return res.status(400).json({
        status: "failed",
        msg: "Email is required",
      });
    }

    let passwordHash;

    if (password === "" || password === null) {
      passwordHash = user.password;
    } else {
      passwordHash = await bcrypt.hash(password, 10);
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "failed",
        msg: "Passwords do not match",
      });
    }

    const response = await db.admin.update({
      where: {
        id: req.userId,
      },
      data: {
        username,
        email,
        password: passwordHash,
        address,
        phoneNumber,
        role: user.role,
      },
    });
    res.status(200).json({
      status: "success",
      msg: "Update admin successfully",
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

export { updateAdmin };
