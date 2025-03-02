import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions, Plugin } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart: React.FC = () => {
  const percent = 97.66
  const data = {
    labels: ['Rate', 'Remaining'],
    datasets: [
      {
        label: 'อัตราความแม่นยำ',
        data: [ percent, 100 -  percent],
        backgroundColor: ['#594BF9', '#E0E0E0'],
        borderColor: ['#594BF9', '#E0E0E0'],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20, 
        },
      },
      title: {
        display: true,
        text: 'อัตราความแม่นยำการประมวลผล',
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
    
    cutout: '60%', 
  };

  const textCenter: Plugin<'doughnut'> = {
    id: 'textCenter',
    beforeDatasetDraw(chart) {
      const { ctx, data } = chart;
      ctx.save();
      const dataset = data.datasets[0];
      const meta = chart.getDatasetMeta(0);
      const total = dataset.data.reduce((acc, value) => acc + (typeof value === 'number' ? value : 0), 0);
      const percentage = dataset.data[0] / total * 100;

      ctx.font = 'bolder 30px sans-serif';
      ctx.fillStyle = '#594BF9';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const centerX = (meta.data[0].x + meta.data[1].x) / 2;
      const centerY = (meta.data[0].y + meta.data[1].y) / 2;
      ctx.fillText(`${percentage.toFixed(2)}%`, centerX, centerY);
      ctx.restore();
    },
  };

  return <Doughnut data={data} options={options} plugins={[textCenter]} />;
};

export default DoughnutChart;
