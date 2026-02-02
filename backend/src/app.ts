import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";

import { rateLimit } from "express-rate-limit";
import { NotFoundError } from "./errors/not-found-error";
import config from "./config";
import productRoutes from "./routes/product";
import orderRoutes from "./routes/order";
import { errorLogger, requestLogger } from "./middlewares/logger";
import errorHandler from "./middlewares/error-handler";

const { PORT, DB_ADDRESS } = config;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use(requestLogger);

app.use(limiter);

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(DB_ADDRESS);

app.use("/", productRoutes);
app.use("/", orderRoutes);

app.use("*", (_req, _res, next) => {
  next(new NotFoundError("Route not found"));
});

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT, () => {
  const now = new Date();
  console.log(
    `Server started at ${now.toLocaleString()}. Listening on port ${PORT}`,
  );
});
