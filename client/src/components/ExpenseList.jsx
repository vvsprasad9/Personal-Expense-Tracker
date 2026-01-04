import React from "react";

const ExpenseList = ({ expenses, deleteExpense }) => (
  <section className="expense-list-section">
    <h2>Expense List</h2>
    <div className="expense-list">
      {expenses.length === 0 ? (
        <p>No expenses added yet.</p>
      ) : (
        expenses.map((exp) => (
          <div className="expense-item" key={exp._id}>
            <div className="expense-details">
              <strong>{exp.description}</strong> ({exp.category})<br />$
              {exp.amount.toFixed(2)} on{" "}
              {new Date(exp.date).toLocaleDateString()}
            </div>
            <button
              className="delete-btn"
              onClick={() => deleteExpense(exp._id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  </section>
);

export default ExpenseList;
