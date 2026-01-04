import React, { useState, useRef, useEffect } from "react";

const ExpenseForm = ({ addExpense }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [date, setDate] = useState("");

  const otherInputRef = useRef(null);

  // ✅ Automatically focus the “Other” input when shown
  useEffect(() => {
    if (category === "Other" && otherInputRef.current) {
      otherInputRef.current.focus();
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalCategory =
      category === "Other" ? otherCategory.trim() : category;

    if (!description || !amount || !finalCategory || !date) {
      return alert("Please fill all fields");
    }

    addExpense({
      description,
      amount: parseFloat(amount),
      category: finalCategory,
      date,
    });

    setDescription("");
    setAmount("");
    setCategory("");
    setOtherCategory("");
    setDate("");
  };

  return (
    <section className="form-section">
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="💬 Description"
            required
          />

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="💲 Amount"
            step="0.01"
            required
          />
        </div>

        <div className="form-row">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Food">🍔 Food</option>
            <option value="Transport">🚌 Transport</option>
            <option value="Shopping">🛍️ Shopping</option>
            <option value="Bills">💡 Bills & Utilities</option>
            <option value="Health">💊 Health</option>
            <option value="Entertainment">🎬 Entertainment</option>
            <option value="Education">📚 Education</option>
            <option value="Savings">💰 Savings</option>
            <option value="Travel">✈️ Travel</option>
            <option value="Other">📦 Other</option>
          </select>

          {category === "Other" && (
            <input
              type="text"
              ref={otherInputRef}
              value={otherCategory}
              onChange={(e) => setOtherCategory(e.target.value)}
              placeholder="✏️ Specify category"
              required
              className="fade-in"
            />
          )}
        </div>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <button type="submit">➕ Add Expense</button>
      </form>
    </section>
  );
};

export default ExpenseForm;
