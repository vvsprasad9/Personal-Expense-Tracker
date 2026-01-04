const express = require("express");
const {
  getExpenses,
  addExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getExpenses);
router.post("/", authMiddleware, addExpense);
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;
