import { request, response } from "express";
import jwt from "jsonwebtoken";

async function validateUser(req = request, res = response, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        status: "failed",
        msg: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "failed",
        msg: "Invalid Token",
      });
    }

    const key = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, key);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    // apabila token expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "failed",
        msg: "Token Expired",
      });
    }
    // apabila token invalid
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({
        status: "failed",
        msg: "Invalid Token",
      });
    }
    return res.status(500).json({
      status: "error",
      msg: error.message,
    });
  }
}

export { validateUser };
