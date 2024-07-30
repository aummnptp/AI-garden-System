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
    labels: ['Putthipong Chobngam', 'Kittinan Charearnsong', 'Member1 ', 'Member2','Member3','Member4'],
    datasets: [
      {
        label: 'วิดีโอ',
        data: [21, 15, 14, 13, 11,5],
        backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)',
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

  const doubleLabels: Plugin<'bar'> = {
    id: 'doubleLabels',
    afterDatasetsDraw(chart, args, plugins) {
    const {ctx, data} =chart;
    ctx.save();
    chart.getDatasetMeta(0).data.forEach((dataPoint,index) => {
        ctx.font = 'bold 12px sans-serif'
        ctx.fillStyle = 'black';
        ctx.fillText(data.datasets[0].data[index],dataPoint.x,dataPoint.y)
      
    });
    }
  }
const profileImage: Plugin<'bar'> = {
  id: 'profileImage',
  afterDatasetsDraw(chart, args, plugins) {
    const { ctx, data, chartArea: { left, right }, scales: { y } } = chart;
    ctx.save();

    const dataset = data.datasets[0] as typeof data.datasets[0] & { images: string[] };
    const images = dataset.images;

    images.forEach((image, index) => {
      const label = new Image();
      label.src = image;
      const yPosition = y.getPixelForValue(index) - 15; // Adjust to center image vertically
      const xPosition = left - 35; // Position image to the left of the y-axis labels

      // Draw the image
      ctx.drawImage(label, xPosition, yPosition, 30, 30); // Adjust width and height as needed
    });

    ctx.restore();
  }
}

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    scales:{
      x:{
        beginAtZero:true,
        grace:10,
      },
    },
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

  return <Bar data={data} options={options} plugins={[profileImage,doubleLabels]}/>;
};

export default UsageBarChart;