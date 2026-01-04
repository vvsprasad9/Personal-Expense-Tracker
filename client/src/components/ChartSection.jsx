import React from "react";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title
);

const ChartSection = ({ expenses }) => {
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {});

  const dates = [...new Set(expenses.map((exp) => exp.date))].sort();
  const amountsByDate = dates.map((date) =>
    expenses
      .filter((e) => e.date === date)
      .reduce((sum, e) => sum + Number(e.amount), 0)
  );

  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4bc0c0",
          "#9966ff",
          "#ff9f40",
        ],
      },
    ],
  };

  const lineData = {
    labels: dates,
    datasets: [
      {
        label: "Spending Over Time",
        data: amountsByDate,
        borderColor: "#1a73e8",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  return (
    <section className="chart-section">
      <h2>Spending Analysis</h2>
      <div className="chart-container">
        <Pie data={pieData} />
      </div>
      <div className="chart-container">
        <Line data={lineData} />
      </div>
    </section>
  );
};

export default ChartSection;
