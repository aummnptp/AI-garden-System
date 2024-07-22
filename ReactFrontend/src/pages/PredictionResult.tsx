import React from 'react';
import { useLocation } from 'react-router-dom';
import MiniFooter from '../components/MiniFooter';

const PredictionResult: React.FC = () => {
  const location = useLocation();
  const { prediction = {}, image, fileName } = location.state || {}; // ดึงข้อมูลการพยากรณ์และภาพจาก state

  console.log("Prediction Data:", prediction);
  console.log("Image Data:", image);
  console.log("File Name:", fileName);

  // แปลงข้อมูลการพยากรณ์เป็นรายการที่แสดงผล
  const resultEntries = Object.entries(prediction);

  return (
    <>
      <div className="flex bg-neutral-100 h-full pb-32">
        {/* Sidebar placeholder */}
        <div className="w-1/5 bg-neutral-200 h-full"></div>

        {/* Main content */}
        <div className="w-4/5 items-center justify-center h-full grid grid-cols-1">
          <div className="mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative">
            <div className="flex justify-between items-center p-5">
              <h1 className="text-3xl font-medium tracking-tight text-indigo-900 dark:text-black">
                ผลลัพธ์
              </h1>
            </div>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>

            {/* Prediction result display */}
            <div className="mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative">
              
              <div className="flex justify-between items-center p-5 relative">
              {/* Display the uploaded image */}
              <div className="flex justify-center mb-8">
                {image ? (
                  <img src={image} alt="Uploaded" className="w-80 h-80 object-cover rounded-lg" />
                ) : (
                  <div className="w-80 h-80 flex items-center justify-center bg-gray-300 rounded-lg">
                    <span>ไม่สามารถแสดงภาพได้</span>
                  </div>
                )}
              </div>

              {/* Display the prediction details */}
              <div className="space-y-2 text-center w-full">
                <strong>{fileName || 'ไม่มีชื่อไฟล์'}</strong> 
                {resultEntries.length > 0 ? (
                  resultEntries.map(([key, value], index) => (
                    <div key={index}>
                      <strong>{key}:</strong> 
                      {typeof value === 'string' || typeof value === 'number' ? value : 'ไม่มีข้อมูล'}
                    </div>
                  ))
                ) : (
                  <div>
                    <strong>ไม่มีข้อมูลการพยากรณ์</strong>
                  </div>
                )}
              </div>
              
              </div>
            </div>
          </div>
        </div>
      </div>
      <MiniFooter />
    </>
  );
};

export default PredictionResult;
