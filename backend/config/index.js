import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { config as configDotenv } from "dotenv";

// Load biến môi trường từ .env
configDotenv();

// ✅ Khai báo tất cả biến môi trường ở đầu file
const {
  DB_CONNECTION_STRING,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

// ✅ Kết nối MongoDB
export const connectMongoDB = async () => {
  try {
    await mongoose.connect(DB_CONNECTION_STRING);
    console.log("💻 MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};

// ✅ Cấu hình Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export default cloudinary;
