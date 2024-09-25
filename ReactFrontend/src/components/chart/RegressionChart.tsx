import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

interface RegressionChartProps {
  regressionParams: number[];
}

const RegressionChart: React.FC<RegressionChartProps> = ({ regressionParams }) => {
  const [chartData, setChartData] = useState<any>(null);
  const chartRef = useRef<any>(null); // สร้าง ref สำหรับ Chart

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy(); // ทำลายกราฟเดิมก่อนสร้างใหม่
    }

    if (regressionParams && regressionParams.length > 0) {
      const newChartData = {
        labels: regressionParams.map((_, index) => (index + 1).toString()), // กำหนด labels ให้เป็นตัวเลข
        datasets: [
          {
            label: 'Regression Data',
            data: regressionParams, // ข้อมูลที่ใช้ในแกน y
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 2,
            fill: false, // ปิดการเติมสีด้านล่างกราฟ
            tension: 0.4, // เพิ่มความโค้งให้เส้น
            pointRadius: 0, // ซ่อนจุดโดยค่าเริ่มต้น
            pointHoverRadius: 6, // แสดงจุดเมื่อ cursor ชี้
          },
        ],
      };

      const ctx = document.getElementById('regressionChart') as HTMLCanvasElement;
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: newChartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
            },
            title: {
              display: true,
              text: 'Regression Chart',
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Points',
              },
              ticks: {
                callback: function (value, index) {
                  // แสดงแค่ตัวเลข 0, 100, 200, 300, 400 เท่านั้น
                  return index % 100 === 0 ? index : null;
                },
              },
            },
            y: {
              title: {
                display: true,
                text: 'Value',
              },
              min: -0.5, // ปรับค่า min ของแกน Y
              max: 1.5,  // ปรับค่า max ของแกน Y ให้ครอบคลุมกราฟ
            },
          },
        },
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // ทำลายกราฟเมื่อคอมโพเนนต์ถูก unmount
      }
    };
  }, [regressionParams]);

  return (
    <div className="w-full h-80">
      <canvas id="regressionChart"></canvas> {/* ใช้ ID สำหรับ canvas */}
    </div>
  );
};

export default RegressionChart;
