import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import router from "./app/routes";

const app: Application = express();

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/", router);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  // throw new ApiError();
  // res.send({ error });
  // res.send("hello world");
});

app.use(globalErrorHandler);

export default app;
