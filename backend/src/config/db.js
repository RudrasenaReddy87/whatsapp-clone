import mongoose from "mongoose";

let dbInstance = null;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    dbInstance = conn.connection.db; // Native MongoDB driver DB instance
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!dbInstance) {
    throw new Error("Database not initialized. Call connectDB() first.");
  }
  return dbInstance;
};
