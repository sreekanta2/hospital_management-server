import mongoose from "mongoose";
import { DB_NAME } from "../constant";
import { errorLogger, infoLogger } from "../shared/logger";

const connectDB = async () => {
  try {
    const mongodbInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    infoLogger.info(
      `💕 MONGODB connected successfully `,
      mongodbInstance.connection.host
    );
  } catch (error) {
    errorLogger.error(`  MONGODB connect field :`, error);
  }
};
export default connectDB;
