import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions, Plugin } from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UsageBarChart: React.FC = () => {
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
        images:["/images/homeImage/puttipong.jpg","/images/homeImage/puttipong.jpg","/images/homeImage/puttipong.jpg","/images/homeImage/puttipong.jpg"
          ,"/images/homeImage/puttipong.jpg","/images/homeImage/puttipong.jpg"
        ]
      },
    ],
  };

  // profile image
  const XScaleImage: Plugin<'bar'> = {
    id: 'xScaleImage',
    afterDatasetsDraw(chart, args, plugins) {
      const { ctx, data, chartArea: { bottom, }, scales: { x,y } } = chart;
      ctx.save();

      const dataset = data.datasets[0] as typeof data.datasets[0] & { images: string[] };
      const images = dataset.images;

      images.forEach((image, index) => {
        const label = new Image();
        label.src = image;
        const xPosition = x.getPixelForValue(index) - (30/2); // Adjust to center image
        const yPosition = y.getPixelForValue(index)-30; // Adjust yPosition to place image below the chart
        ctx.drawImage(label, xPosition, yPosition, 30, 30); // Adjust width and height as needed
      });

      ctx.restore();
    }
  }

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
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

  return <Bar data={data} options={options} plugins={[XScaleImage]}/>;
};

export default UsageBarChart;