import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface UploadHistory {
  prediction: Record<string, any>;
  response_keys: {
    key: string;
    displayFormat: string;
  }[];
}

const Barchart: React.FC = () => {
  const { workspaceId, projectId } = useParams<{ workspaceId: string, projectId: string }>();  
  const [chartData, setChartData] = useState<{ labels: string[]; counts: number[] }>({ labels: [], counts: [] });
  const [selectedKey, setSelectedKey] = useState<string>('');  // state สำหรับเก็บ Key ที่เลือก
  const [availableKeys, setAvailableKeys] = useState<string[]>([]);  // state สำหรับเก็บ Key ที่มีให้เลือก
  const [keyMeaningMap, setKeyMeaningMap] = useState<Record<string, string>>({});
const [selectedMeaning, setSelectedMeaning] = useState<string>(''); // สำหรับเก็บ meaning ที่เลือก


useEffect(() => {
  if (!workspaceId || !projectId) return;

  const fetchData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/${workspaceId}/projects/all-history/${projectId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data: UploadHistory[] = await response.json();

        // กรองเฉพาะ response_keys ที่มี displayFormat เป็น text
        const textKeys = data[0]?.response_keys?.filter(item => item.displayFormat === 'text');

        // Mapping ระหว่าง key กับ meaning
        const keyMeaning = textKeys.reduce((acc: Record<string, string>, item) => {
          acc[item.key] = item.meaning || item.key; // ถ้าไม่มี meaning ให้ใช้ key แทน
          return acc;
        }, {});

        setKeyMeaningMap(keyMeaning);

        // เก็บเฉพาะ key ที่มี displayFormat เป็น text
        const availableKeyList = textKeys.map(item => item.key);
        setAvailableKeys(availableKeyList);

        // ตั้งค่าเริ่มต้นให้ selectedKey เป็น key แรก
        if (!selectedKey && availableKeyList.length > 0) {
          setSelectedKey(availableKeyList[0]);
        }
      } else {
        console.error('Failed to fetch upload history');
      }
    } catch (error) {
      console.error("Error fetching upload history:", error);
    }
  };

  fetchData();
}, [workspaceId, projectId]);


// อัปเดต selectedMeaning เมื่อ selectedKey เปลี่ยนแปลง
useEffect(() => {
  setSelectedMeaning(keyMeaningMap[selectedKey] || selectedKey);
}, [selectedKey, keyMeaningMap]);

  
  // ดึงข้อมูลเมื่อ selectedKey เปลี่ยนแปลง
  useEffect(() => {
    // ตรวจสอบว่ามี workspaceId, projectId และ selectedKey ก่อน Fetch
    if (!workspaceId || !projectId || !selectedKey) return;
  
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/${workspaceId}/projects/all-history/${projectId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
  
        if (response.ok) {
          const data: UploadHistory[] = await response.json();
  
          // ดึงค่าจาก prediction ตาม selectedKey
          const selectedValues = data.map(item => item.prediction[selectedKey]);
  
          // นับจำนวนการเกิดของแต่ละค่า
          const valueCount = selectedValues.reduce((acc: Record<string, number>, value) => {
            const valueStr = String(value).toLowerCase().trim();  // แปลงเป็นตัวพิมพ์เล็กและตัดช่องว่าง
            acc[valueStr] = (acc[valueStr] || 0) + 1;
            return acc;
          }, {});
  
          // จัดเรียงตามจำนวนจากมากไปน้อย แล้วเลือก 5 อันดับแรก
          const sortedValues = Object.entries(valueCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
  
          // แยก labels และ counts สำหรับ Chart.js
          const labels = sortedValues.map(item => item[0]);
          const counts = sortedValues.map(item => item[1]);
  
          // เก็บข้อมูลสำหรับแสดงผล
          setChartData({ labels, counts });
        } else {
          console.error('Failed to fetch upload history');
        }
      } catch (error) {
        console.error("Error fetching upload history:", error);
      }
    };
  
    fetchData();
  }, [workspaceId, projectId, selectedKey]);
  

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: `จำนวนการพบของ ${selectedMeaning}`,
        data: chartData.counts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
        ],
        borderWidth: 2,
      },
    ],
  };
  

  const options: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: Math.max(...chartData.counts) + 1, // แนะนำค่าสูงสุด
        ticks: {
          precision: 0,
          stepSize: 2,   // ไม่แสดงทศนิยม
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: `กราฟแสดงอันดับการตรวจพบใน project`,
        align: 'start',
        position: 'top', 
        font: {
          size: 20,
        },
        color: '#312e81',
        padding: {
          top: 20, 
          bottom: 40, // เว้นที่ว่างให้ Dropdown
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `จำนวนการพบ: ${value}`;
          }
        }
      }
    },
    layout: {
      padding: {
        top: 20, 
        bottom: 20, 
      },
    },
  };
  
  

  return (
    <div className="w-full relative">
      {/* Dropdown สำหรับเลือก Key */}
      <div className="absolute top-[70px] left-[20px] z-10">
        <label className="text-lg font-medium text-indigo-900 mr-2">เลือกผลลัพธ์ตาม</label>
        <select
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value)}
          className="p-2 border rounded-md"
        >
          {availableKeys.map((key) => (
            <option key={key} value={key}>
              {keyMeaningMap[key] || key}
            </option>
          ))}
        </select>
      </div>
  
      {/* Bar Chart */}
      <Bar data={data} options={options} />
    </div>
  );
  
};

export default Barchart;
