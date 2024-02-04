import dotenv from "dotenv";
import app from "./app";
import connectDB from "./db";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(` ⨷  Server is running  PORT : ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.log(` MONGODB CONNECTION FIELD : ${err}`);
  });
