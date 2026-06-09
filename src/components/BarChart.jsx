import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart({ labels, values }) {
  const data = {
    labels: labels,
    datasets: [{
      label: 'This Month Expenses',
      data: values,
      backgroundColor: '#4caf50'
    }]
  };

  return <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />;
}