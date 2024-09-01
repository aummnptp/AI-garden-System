import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement,  Title, Tooltip, Legend, ChartOptions } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Barchart: React.FC = () => {
  const data = {
    labels: ['ObjectA', 'ObjectB', 'ObjectC', 'ObjectD','ObjectE','ObjectF'],
    datasets: [
      {
        label: 'วิดีโอ',
        data: [21, 15, 14, 13, 11,5],
        backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                ],
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false, 
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'อันดับวัตถุที่ตรวจจับได้ในAI นี้',
        align: 'start',
        font: {
          size: 20,
        },
        color: '#312e81',
        padding: {
          top: 20, 
          bottom: 20, 
        },
        
      },
    },
    layout: {
      padding: {
        top: 20, 
        bottom: 20, 
      },
    },
    
 
  };

  return <Bar data={data} options={options} />;
};

export default Barchart;
