const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("❌ MONGO_URI not set in environment");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // These options are optional in Mongoose 7+, but safe to include
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
};

module.exports = connectDB;
