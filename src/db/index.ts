import mongoose from "mongoose";
import { DB_NAME } from "../constant";
console.log(" this is my project setup done ");

const connectDB = async () => {
  try {
    const mongodbInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `💕 MONGODB connected successfully `,
      mongodbInstance.connection.host
    );
  } catch (error) {
    console.log(`  MONGODB connect field :`, error);
    process.exit(1);
  }
};
export default connectDB;
