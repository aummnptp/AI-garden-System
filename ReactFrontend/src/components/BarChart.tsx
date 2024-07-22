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
            label: 'รวม',
            data: [(65+21), (58+15), (58+14), (43+13),(30+11),(20+5)],
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
      {
        label: 'รูปภาพ',
        data: [65, 58, 58, 43,30,20],
        backgroundColor:   'rgba(201, 203, 207, 0.2)',
        borderColor: 'rgb(201, 203, 207)',
        borderWidth: 2,
      },
      {
        label: 'วิดีโอ',
        data: [21, 15, 14, 13, 11,5],
        backgroundColor: 'rgba(89, 75, 249, 0.2)',
        borderColor: 'rgba(89, 75, 249, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const, // TypeScript requires 'as const' for literal types
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
