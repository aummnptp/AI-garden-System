import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import MiniFooter from '../components/MiniFooter';
import Sidebar from "../components/Sidebar";
import RegressionChart from '../components/chart/RegressionChart'; // Import RegressionChart
import ProjectData from "../data/ProjectData";
import { PictureOutlined, VideoCameraOutlined, } from "@ant-design/icons";
import Button from '@mui/material/Button';
import { NoteAddOutlined } from '@mui/icons-material';

const PredictionResultPage: React.FC = () => {
  const { workspaceId, projectId } = useParams<{ workspaceId?: string, projectId?: string }>();
  const { modelId } = useParams<{ modelId: string }>();
  const [note, setNote] = useState(''); // State for note
  const [isEditing, setIsEditing] = useState(false); // State for editing mode
  const [savedNote, setSavedNote] = useState(''); // State for saved note

  const location = useLocation();
  const state = location.state || {};
  const { prediction, file, fileName, ai_type, regression_params, response_keys } = state;

  if (typeof workspaceId === 'undefined' || typeof projectId === 'undefined') {
    return <div>ไม่มี ID ของพื้นที่ทำงานหรือ ID ของโครงการ</div>;
  }

  const workspaceIdNum = parseInt(workspaceId, 10);
  const projectIdNum = parseInt(projectId, 10);

  const workspace = ProjectData.find(ws => ws.workspaceId === workspaceIdNum);

  if (!workspace) {
    return <div>ไม่พบพื้นที่ทำงาน</div>;
  }

  const detail = workspace.details.find(d => d.id === projectIdNum);

  if (!detail) {
    return <div>ไม่พบรายละเอียดโปรเจก</div>;
  }



  const resultEntries = prediction ? Object.entries(prediction) : [];
  console.log("Prediction:", prediction);
  console.log("Response keys:", response_keys);
  // ฟังก์ชันเพื่อแปลง key เป็น meaning
  const getMeaningForKey = (key: string) => {
    console.log("Key being processed:", key);  // ตรวจสอบค่า key ที่รับเข้ามา
    const keyWithMeaning = response_keys?.find((item: { key: string, meaning: string }) => item.key === key);
    console.log("Matched key with meaning:", keyWithMeaning);  // ตรวจสอบว่ามีการจับคู่ key กับ meaning หรือไม่
    return keyWithMeaning ? keyWithMeaning.meaning : key;  // ถ้าไม่มี matching ให้ใช้ key เดิม
  };

  // Handle save note
  const handleSaveNote = () => {
    setSavedNote(note);
    setIsEditing(false);
  };

  // Handle cancel editing
  const handleCancel = () => {
    setNote(savedNote); // Revert to saved note
    setIsEditing(false);
  };

  return (
    <>
      <div className="flex bg-neutral-100 h-full pb-32">
        <Sidebar />
        <div className="w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32 h-full min-h-screen">
          <div className="mt-10 px-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative">

            <h1 className="text-3xl my-5 font-medium tracking-tight text-indigo-900">ผลลัพธ์</h1>

            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>

            {/* ส่วนนี้เป็น flex เพื่อจัดเรียงให้กราฟและข้อมูลผลลัพธ์อยู่ในแนวเดียวกัน */}

            <div className="flex w-full my-5">
              {/* แสดงกราฟ */}
              <div className=" w-[60%] text-center space-y-2  border rounded-[5px] p-10  flex justify-center ">
                {ai_type === 'Regression' && regression_params ? (
                  <RegressionChart regressionParams={regression_params} />
                ) : (
                  <div className="justify-center mb-8">
                    {file ? (
                      <img src={file} alt="Uploaded or Result" className="w-full h-[500px] object-fill rounded-lg" />
                    ) : (
                      <div className="w-80 h-80 flex items-center justify-center bg-gray-300 rounded-lg">
                        <span>ไม่สามารถแสดงภาพได้</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* แสดงข้อมูลผลลัพธ์ */}
              <div className="w-[40%] border rounded-[5px]  p-10 ">
                <div className="space-y-2 w-full">
                  <div className="flex justify-start items-center p-0 space-x-4">
                    {detail.inputType === 'รูปภาพ' ? (
                      <PictureOutlined style={{ fontSize: '32px', color: '#4f46e5' }} />
                    ) : (
                      <VideoCameraOutlined style={{ fontSize: '32px', color: '#4f46e5' }} />
                    )}
                    <h1 className="text-3xl font-medium tracking-tight text-indigo-900 mb-0">{fileName || 'ไม่มีชื่อไฟล์'}</h1>
                  </div>
                  <div className="flex justify-start items-center p-0 space-x-4">
                    <span className="text-gray-600 text-lg">{detail.name}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-400 text-lg">{ai_type}</span>
                  </div>
                  <div className="flex justify-start mb-2 mt-4">
                    <span className="w-fit bg-indigo-600 rounded-[5px] me-2 px-2.5 py-0.5 text-white text-lg font-normal">tag1</span>
                    <span className="w-fit bg-indigo-600 rounded-[5px] me-2 px-2.5 py-0.5 text-white text-lg font-normal">tag2</span>
                    <span className="w-fit bg-indigo-600 rounded-[5px] me-2 px-2.5 py-0.5 text-white text-lg font-normal">tag3</span>
                  </div>
                  <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>
                  <div className="py-4">
                    <div>
                      <h4 className="text-2xl "> <i className="bi bi-clipboard-check-fill text-blue-600 mr-2"></i> ผลลัพธ์การทำนาย</h4>
                      <table className="min-w-full mt-4 bg-white rounded-lg shadow">
                        {resultEntries.length > 0 ? (
                          <tbody>
                            {/* Loop through resultEntries */}
                            {resultEntries.map(([key, value], index) => {
                              const displayText = getMeaningForKey(key); // Get the display text (meaning or key)
                              return (
                                <tr key={index} className="bg-gray-100 border-b">
                                  <td className="py-3 px-4 text-indigo-800 text-xl font-medium">{displayText}</td>
                                  <td className="py-3 px-4 text-gray-800 text-xl">
                                    {typeof value === 'number' ? value.toFixed(2) : value?.toString() || 'ไม่มีข้อมูล'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        ) : (
                          <tbody>
                            <tr>
                              <td colSpan={2} className="text-center py-4">
                                ไม่มีข้อมูล
                              </td>
                            </tr>
                          </tbody>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-start">
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#3b82f6",
                "&:hover": {
                  backgroundColor: "#2563eb", // สีที่ต้องการเมื่อ hover
                },
              }}

            >
              <NoteAddOutlined/>เพิ่ม Note
            </Button>
          </div>
            <div className="flex justify-end">
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#3b82f6",
                "&:hover": {
                  backgroundColor: "#2563eb", // สีที่ต้องการเมื่อ hover
                },
              }}

            >
              อัพโหลดอีกครั้ง
            </Button>
          </div>
          </div>
          
        </div>
      </div>
      <MiniFooter />
    </>
  );
};

export default PredictionResultPage;
