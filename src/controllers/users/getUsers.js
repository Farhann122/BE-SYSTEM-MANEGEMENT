import { request, response } from "express";
import db from "../../connector";

async function getUsers(req = request, res = response) {
  try {
    const response = await db.users.findMany({
      select: {
        id: true,
        fullname: true,
        address: true,
        phoneNumber: true,
        role: true,
      },
    });
    res.status(200).json({
      status: "success",
      msg: "Get all users successfully",
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      msg: error.message,
    });
  }
}

export { getUsers };
