import React, { useEffect, useState } from 'react';
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
import { useHistoryData } from '../../hook/history/useHistoryData';


interface UploadHistory {
  prediction: Record<string, any>;
  response_keys: {
    key: string;
    displayFormat: string;
    meaning?: string;
  }[];
}

const Barchart: React.FC = () => {
  const [chartData, setChartData] = useState<{ labels: string[]; counts: number[] }>({ labels: [], counts: [] });
  const [selectedKey, setSelectedKey] = useState<string>('');  
  const [availableKeys, setAvailableKeys] = useState<string[]>([]); 
  const [keyMeaningMap, setKeyMeaningMap] = useState<Record<string, string>>({});
  const [selectedMeaning, setSelectedMeaning] = useState<string>('');
  const { projectHistory, isLoadingHistory } = useHistoryData();


  useEffect(() => {
    if (!projectHistory || isLoadingHistory) return;

    const data: UploadHistory[] = projectHistory;

    const textKeys = data[0]?.response_keys?.filter(item => item.displayFormat === 'text') || [];

    const keyMeaning = textKeys.reduce((acc: Record<string, string>, item) => {
      acc[item.key] = item.meaning || item.key;
      return acc;
    }, {});

    setKeyMeaningMap(keyMeaning);

    const availableKeyList = textKeys.map(item => item.key);
    setAvailableKeys(availableKeyList);

    if (!selectedKey && availableKeyList.length > 0) {
      setSelectedKey(availableKeyList[0]);
    }
  }, [projectHistory, isLoadingHistory]);



  useEffect(() => {
    setSelectedMeaning(keyMeaningMap[selectedKey] || selectedKey);
  }, [selectedKey, keyMeaningMap]);


  useEffect(() => {
    if (!projectHistory || isLoadingHistory || !selectedKey) return;

    const data: UploadHistory[] = projectHistory;

    const selectedValues = data.map(item => item.prediction[selectedKey]);

    const valueCount = selectedValues.reduce((acc: Record<string, number>, value) => {
      const valueStr = String(value).toLowerCase().trim();  
      acc[valueStr] = (acc[valueStr] || 0) + 1;
      return acc;
    }, {});

    const sortedValues = Object.entries(valueCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const labels = sortedValues.map(item => item[0]);
    const counts = sortedValues.map(item => item[1]);

    setChartData({ labels, counts });

  }, [projectHistory, isLoadingHistory, selectedKey]);


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
        suggestedMax: Math.max(...chartData.counts) + 1,
        ticks: {
          precision: 0,
          stepSize: 2,  
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
          bottom: 40, 
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
