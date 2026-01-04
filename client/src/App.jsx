import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Summary from "./components/Summary";
import ChartSection from "./components/ChartSection";
import Login from "./pages/Login";
import Register from "./pages/Register";
import api from "./services/api";
import "./App.css";

function Dashboard({ onLogout, user }) {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filter, setFilter] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const handleLogout = () => {
    onLogout();
  };

  // ✅ Fetch Expenses on Load
  const fetchExpenses = async () => {
    try {
      const { data } = await api.get("/expenses");
      setExpenses(data);
      setFilteredExpenses(data);
    } catch (err) {
      console.error("❌ Failed to fetch expenses:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ✅ Apply Filters Locally (No extra backend calls)
  const applyFilters = () => {
    let filtered = [...expenses];

    if (filter !== "all") filtered = filtered.filter((e) => e.category === filter);

    if (filterDate)
      filtered = filtered.filter(
        (e) => e.date.slice(0, 10) === filterDate
      );

    if (filterMonth) {
      const [year, month] = filterMonth.split("-");
      filtered = filtered.filter((e) => {
        const d = new Date(e.date);
        return (
          d.getFullYear() === parseInt(year) &&
          d.getMonth() + 1 === parseInt(month)
        );
      });
    } else if (filterYear) {
      filtered = filtered.filter(
        (e) => new Date(e.date).getFullYear() === parseInt(filterYear)
      );
    }

    setFilteredExpenses(filtered);
  };

  // ✅ Reset Filters
  const resetFilters = () => {
    setFilter("all");
    setFilterDate("");
    setFilterMonth("");
    setFilterYear("");
    setFilteredExpenses(expenses);
  };

  // ✅ Add Expense (Instant Update)
  const addExpense = async (expense) => {
    try {
      const { data } = await api.post("/expenses", expense);

      // Add new item to lists
      const updated = [data, ...expenses];
      setExpenses(updated);

      // Reapply active filters instantly
      let filtered = updated;
      if (filter !== "all") filtered = filtered.filter((e) => e.category === filter);
      if (filterDate) filtered = filtered.filter((e) => e.date.slice(0, 10) === filterDate);
      if (filterMonth) {
        const [year, month] = filterMonth.split("-");
        filtered = filtered.filter((e) => {
          const d = new Date(e.date);
          return d.getFullYear() === +year && d.getMonth() + 1 === +month;
        });
      } else if (filterYear) {
        filtered = filtered.filter(
          (e) => new Date(e.date).getFullYear() === +filterYear
        );
      }

      setFilteredExpenses(filtered);
      console.log("✅ Expense added:", data);
    } catch (err) {
      console.error("❌ Error adding expense:", err);
      alert("Failed to add expense");
    }
  };

  // ✅ Delete Expense (Instant Update)
  const deleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      const updated = expenses.filter((e) => e._id !== id);
      setExpenses(updated);

      // Reapply filters to update UI immediately
      let filtered = updated;
      if (filter !== "all") filtered = filtered.filter((e) => e.category === filter);
      if (filterDate) filtered = filtered.filter((e) => e.date.slice(0, 10) === filterDate);
      if (filterMonth) {
        const [year, month] = filterMonth.split("-");
        filtered = filtered.filter((e) => {
          const d = new Date(e.date);
          return d.getFullYear() === +year && d.getMonth() + 1 === +month;
        });
      } else if (filterYear) {
        filtered = filtered.filter(
          (e) => new Date(e.date).getFullYear() === +filterYear
        );
      }

      setFilteredExpenses(filtered);
      console.log("🗑️ Expense deleted:", id);
    } catch (err) {
      console.error("❌ Failed to delete expense:", err);
      alert("Failed to delete expense");
    }
  };

  return (
    <div className="app-container">
      {/* ---------- Header & Filters ---------- */}
      <header>
        <div className="header-top">
          <h1>Personal Finance Tracker</h1>
          <div className="header-user">
            {user ? (
              <>
                <div className="user-info">
                  <div className="user-name">{user.name || user.email}</div>
                  <div className="user-email">{user.email}</div>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>

        <div className="filter-section">
          <label>Category:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {[...new Set(expenses.map((e) => e.category))].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <label>Date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />

          <label>Month:</label>
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          />

          <label>Year:</label>
          <input
            type="number"
            placeholder="2025"
            min="2000"
            max="2100"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          />

          <div className="filter-buttons">
            <button className="apply-btn" onClick={applyFilters}>
              Apply
            </button>
            <button className="reset-btn" onClick={resetFilters}>
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* ---------- Dashboard ---------- */}
      <main className="container">
        <ExpenseForm addExpense={addExpense} />
        <Summary expenses={filteredExpenses} />
        <ExpenseList expenses={filteredExpenses} deleteExpense={deleteExpense} />
        <ChartSection expenses={filteredExpenses} />
      </main>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    const u = localStorage.getItem("user");
    setUser(u ? JSON.parse(u) : null);
    setLoading(false);
  }, []);

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  // ✅ Handle successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    const u = localStorage.getItem("user");
    setUser(u ? JSON.parse(u) : null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* ✅ Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Register />
            )
          }
        />

        {/* ✅ Protected Route - Dashboard */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Dashboard onLogout={handleLogout} user={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* ✅ Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
