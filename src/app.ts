import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request } from "express";
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
app.get("/", (req: Request, res) => {
  res.send("Working successfully");
});

export default app;
