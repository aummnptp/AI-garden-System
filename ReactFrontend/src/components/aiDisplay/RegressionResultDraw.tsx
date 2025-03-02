import React, { useEffect, useRef, } from 'react';

import Chart from 'chart.js/auto';

interface RegressionChartProps {
  detections: any;
}

const RegressionChart: React.FC<RegressionChartProps> = ({ detections }) => {
  const chartRef = useRef<any>(null); 

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy(); 

    if (detections && detections.length > 0) {
      interface ChartData {
        labels: string[];
        datasets: {
          label: string;
          data: number[];
          borderColor: string;
          borderWidth: number;
          fill: boolean;
          tension: number;
          pointRadius: number;
          pointHoverRadius: number;
        }[];
      }

      const newChartData: ChartData = {
        labels: detections.map((_: any, index: number) => (index + 1).toString()), 
        datasets: [
          {
        label: 'Regression Data',
        data: detections, 
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6, 
          },
        ],
      };

      const ctx = document.getElementById('regressionChart') as HTMLCanvasElement;
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: newChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Points',
              },
              ticks: {
                callback: function (_, index) {
                  return index % 100 === 0 ? index : null;
                },
              },
            },
            y: {
              title: {
                display: true,
                text: 'Value',
              },
              min: -0.5, 
              max: 1.5, 
            },
          },
        },
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); 
      }
    };
  }, [detections]);

  return (
    <div className="w-full h-[400px]">
      <canvas id="regressionChart"></canvas> {/* ใช้ ID สำหรับ canvas */}
    </div>
  );
};

export default RegressionChart;
