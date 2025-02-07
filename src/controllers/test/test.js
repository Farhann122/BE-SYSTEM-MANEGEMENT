import { request, response } from "express";

const test = (req = request, res = response) => {
  try {
    res.json({
      msg: "testing",
    });
  } catch (error) {
    console.log(error);
  }
};

export default test;
