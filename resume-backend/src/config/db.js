import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.warn('⚠️  MONGO_URI not set — skipping MongoDB connection (development mode)');
      return;
    }

    await mongoose.connect(uri);
    console.log("🔥 MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Error:", err.message);
    // don't exit the process here to allow dev workflows without DB configured
    // process.exit(1);
  }
};
