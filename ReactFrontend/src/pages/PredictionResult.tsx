import React from 'react';
import { useLocation } from 'react-router-dom';
import MiniFooter from '../components/MiniFooter';
import Sidebar from "../components/Sidebar";
import { PictureOutlined } from '@ant-design/icons';

const PredictionResult: React.FC = () => {
  const location = useLocation();
  const state = location.state || {}; // ให้ state เป็น object เปล่าๆ ถ้าไม่มีค่า
  const { prediction, file, fileName } = state; // ดึงข้อมูลการพยากรณ์และภาพจาก state
  
  console.log("Prediction Data:", prediction);
  console.log("Image Data:", file);
  console.log("File Name:", fileName);

  // แปลงข้อมูลการพยากรณ์เป็นรายการที่แสดงผล
  const resultEntries = prediction ? Object.entries(prediction) : [];

  return (
    <>
      <div className="flex bg-neutral-100 h-full pb-32">
        <Sidebar />
        {/* Sidebar placeholder */}
        

        {/* Main content */}
        <div className="w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">
          <div className="mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative">
            <div className="flex justify-between items-center p-5">
              <h1 className="text-3xl font-medium tracking-tight text-indigo-900 ">
                ผลลัพธ์
              </h1>
            </div>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>

            {/* Prediction result display */}
            <div className="mt-10 pb-5 h-fit w-full bg-white rounded-[15px] justify-center relative">
              <div className="w-full flex justify-center p-5">
                {/* Display the uploaded or returned image */}
                <div className="justify-center mb-8">
                  {file ? (
                    <img src={file} alt="Uploaded or Result" className="w-full h-80 object-fill rounded-lg" />
                  ) : (
                    <div className="w-80 h-80 flex items-center justify-center bg-gray-300 rounded-lg">
                      <span>ไม่สามารถแสดงภาพได้</span>
                    </div>
                  )}
                </div>
                {/* Display the prediction details */}
                
              </div>
              <div className="text-center space-y-2 w-full">
                  <div className="flex items-center justify-center mb-4">
                    <PictureOutlined
                      style={{ color: "#4F46E5", fontSize: "2em" }} // คุณสามารถปรับสีและขนาดได้ตามต้องการ
                      className="mr-2"
                    />
                    <span className="text-indigo-900 text-2xl font-bold">{fileName || 'ไม่มีชื่อไฟล์'}</span>
                  </div>

                  {resultEntries.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {resultEntries.map(([key, value], index) => (
                        <div key={index} className="flex justify-between items-center border-b border-gray-300 pb-2">
                          <strong className="text-indigo-900">{key}:</strong>
                          <span>{typeof value === 'string' || typeof value === 'number' ? value : 'ไม่มีข้อมูล'}</span>
                        </div>
                      ))}
                    </div>
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
      <MiniFooter />
    </>
  );
};

export default PredictionResult;
