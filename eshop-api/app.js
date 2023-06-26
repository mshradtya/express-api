import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import mongoose from "mongoose";
import "dotenv/config";

import productsRouter from "./routes/products.js";
import usersRouter from "./routes/users.js";
import ordersRouter from "./routes/orders.js";
import categoriesRouter from "./routes/categories.js";
import authJwt from "./helpers/jwt.js";
import errorHandler from "./helpers/errorHandler.js";

const app = express();
const PORT = 3000;
const api = process.env.API_URL;

// middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);

// routes
app.use(`${api}/users`, usersRouter);
app.use(`${api}/products`, productsRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/categories`, categoriesRouter);

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING, {
      dbName: "eshop-database",
    });
    console.log("connected to db");
  } catch (err) {
    console.log(err);
  }
};

await connectMongo();

app.listen(PORT, () => {
  console.log("server running at http://localhost:3000");
});
