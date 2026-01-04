import React from "react";

const Summary = ({ expenses }) => {
  const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const count = expenses.length;
  const average = count > 0 ? total / count : 0;

  return (
    <section className="summary-section">
      <h2>Summary</h2>
      <p>Total Expenses: ${total.toFixed(2)}</p>
      <p>Average Expense: ${average.toFixed(2)}</p>
      <p>Number of Expenses: {count}</p>
    </section>
  );
};

export default Summary;
