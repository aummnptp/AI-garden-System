import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface LineChartProps {
  data: number[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'จำนวนการประมวลผลรายเดือน',
        data: data,
        fill: false,
        backgroundColor: 'rgba(138,43,226,0.6)',
        borderColor: 'rgba(138,43,226,1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default LineChart;