const Expense = require("../models/Expense");
const mongoose = require("mongoose");

// ✅ GET Expenses (with filter support)
const getExpenses = async (req, res) => {
  try {
    const { date, month, year, category } = req.query;
    let filter = {};

    // Ensure only expenses for the authenticated user are returned
    if (req.user) {
      try {
        // coerce to ObjectId for a strict match
        filter.user = mongoose.Types.ObjectId(req.user);
      } catch (e) {
        console.warn("Could not coerce req.user to ObjectId:", req.user);
        filter.user = req.user;
      }
    }
    console.log("🔐 getExpenses for user:", req.user, "using filter:", filter);

    // 🔹 Filter by category
    if (category && category !== "all") {
      filter.category = category;
    }

    // 🔹 Filter by specific date
    if (date) {
      const selectedDate = new Date(date);
      const nextDate = new Date(selectedDate);
      nextDate.setDate(selectedDate.getDate() + 1);

      filter.date = {
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(nextDate.setHours(0, 0, 0, 0)),
      };
    }

    // 🔹 Filter by month and year
    else if (month && year) {
      const start = new Date(`${year}-${month}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      filter.date = { $gte: start, $lt: end };
    }

    // 🔹 Filter by year only
    else if (year) {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${Number(year) + 1}-01-01`);
      filter.date = { $gte: start, $lt: end };
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error("❌ Error in getExpenses:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add Expense
const addExpense = async (req, res) => {
  try {
    console.log("🟡 Incoming Expense:", req.body); // <-- debug line

    const { description, amount, category, date } = req.body;

    if (!description || !amount || !category || !date) {
      console.warn("⚠️ Missing fields:", req.body);
      return res.status(400).json({ message: "All fields are required" });
    }

    const expense = new Expense({
        user: req.user,
        description,
        amount: Number(amount),
        category,
        date: new Date(date),
    });

    const saved = await expense.save();
    console.log("✅ Expense saved:", saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error adding expense:", err);
    res.status(500).json({ message: "Failed to add expense", error: err.message });
  }
};


// ✅ Delete Expense
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Expense.findById(id);
    if (!existing) return res.status(404).json({ message: "Expense not found" });

    // Only the owner can delete the expense
    if (!req.user || existing.user.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized to delete this expense" });
    }

    await Expense.findByIdAndDelete(id);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error("❌ Error in deleteExpense:", err.message);
    res.status(500).json({ message: "Failed to delete expense" });
  }
};

module.exports = { getExpenses, addExpense, deleteExpense };
