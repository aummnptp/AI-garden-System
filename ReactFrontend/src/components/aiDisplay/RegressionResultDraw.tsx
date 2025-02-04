import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

interface RegressionChartProps {
  detections: number[];
}

const RegressionChart: React.FC<RegressionChartProps> = ({ detections }) => {
  const [chartData, setChartData] = useState<any>(null);
  const chartRef = useRef<any>(null); // สร้าง ref สำหรับ Chart

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy(); // ทำลายกราฟเดิมก่อนสร้างใหม่
    }

    if (detections && detections.length > 0) {
      const newChartData = {
        labels: detections.map((_, index) => (index + 1).toString()), // กำหนด labels ให้เป็นตัวเลข
        datasets: [
          {
            label: 'Regression Data',
            data: detections, // ข้อมูลที่ใช้ในแกน y
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
  }, [detections]);

  return (
    <div className="w-full h-[400px]">
      <canvas id="regressionChart"></canvas> {/* ใช้ ID สำหรับ canvas */}
    </div>
  );
};

export default RegressionChart;
