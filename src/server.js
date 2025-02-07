import express from "express";
import cors from "cors";
import env from "dotenv";
import testRoute from "./routes/testRoute";
import authRoute from "./routes/authRoute";

// configuration
const app = express();
env.config();
const PORT = process.env.PORT;

app.use(cors());
app.use(
  express.json({
    limit: "100mb",
  })
);

app.use(
  express.urlencoded({
    extended: "true",
  })
);

// routes
app.use(testRoute);
app.use(authRoute);

// start server
app.listen(PORT, () => {
  console.log(
    `
    ============================

    Server running on port ${PORT}

    ============================
    `
  );
});
