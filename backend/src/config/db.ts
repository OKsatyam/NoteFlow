import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    let mongoUri = process.env.MONGO_URI;
    if (!mongoUri || mongoUri === "undefined" || mongoUri === "null") {
      mongoUri = "mongodb://localhost:27017/noteflow";
    }
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;