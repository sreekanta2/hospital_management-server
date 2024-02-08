import dotenv from "dotenv";
import { Server } from "http";
import app from "./app";
import connectDB from "./db";
import { errorLogger } from "./shared/logger";

dotenv.config({
  path: "./.env",
});
let server: Server;
connectDB()
  .then(() => {
    server = app.listen(process.env.PORT || 5000, () => {
      console.log(` ⨷  Server is running  PORT : ${process.env.PORT || 5000}`);
    });
    process.on("unhandledRejection", (error) => {
      if (server) {
        server.close(() => {
          errorLogger.error(error);
          process.exit(1);
        });
      }
      process.exit(1);
    });
  })
  .catch((err) => {
    errorLogger.error(` MONGODB CONNECTION FIELD : ${err}`);
  });
