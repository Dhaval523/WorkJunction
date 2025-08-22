import mongoose from "mongoose";

const connectDB = async () => {
    try {
<<<<<<< HEAD
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
=======
        console.log("🔗 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("✅ MongoDB connected successfully!");
>>>>>>> 8e47109c94d1ba857991aaec1a720c0c8407c7d9
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;
