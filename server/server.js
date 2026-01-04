const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes");
const userRoutes = require("./routes/userRoutes");

// ✅ Load environment variables early
dotenv.config();

// ✅ Connect DB before app starts
connectDB();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);

// ✅ Health check
app.get("/", (req, res) =>
  res.json({ status: "ok", message: "Expense tracker backend running" })
);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
