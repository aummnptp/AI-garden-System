import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import MiniFooter from '../components/MiniFooter';
import Sidebar from "../components/Sidebar";
import RegressionChart from '../components/chart/RegressionChart'; // Import RegressionChart
import ProjectData from "../data/ProjectData";
import { PictureOutlined, VideoCameraOutlined, SaveOutlined, EditOutlined, CloseOutlined } from "@ant-design/icons";

const PredictionResultPage: React.FC = () => {
  const { workspaceId, projectId } = useParams<{ workspaceId?: string, projectId?: string }>();
  const { modelId } = useParams<{ modelId: string }>();
  const [note, setNote] = useState(''); // State for note
  const [isEditing, setIsEditing] = useState(false); // State for editing mode
  const [savedNote, setSavedNote] = useState(''); // State for saved note

  const location = useLocation();
  const state = location.state || {};
  const { prediction, file, fileName, ai_type, regression_params } = state;

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
          <div className="mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative">
            <div className="flex justify-start items-center p-5">
              <h1 className="text-3xl font-medium tracking-tight text-indigo-900">ผลลัพธ์</h1>
            </div>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>

            {/* ส่วนนี้เป็น flex เพื่อจัดเรียงให้กราฟและข้อมูลผลลัพธ์อยู่ในแนวเดียวกัน */}
            <div className="mt-5 pb-2 h-fit w-full bg-white rounded-[15px] justify-center relative">
              <div className="flex justify-center items-start w-full p-5 space-x-14">
                {/* แสดงกราฟ */}
                <div className="flex-1">
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
                <div className="flex-1 pl-28">
                  <div className="text-center space-y-2 w-full">
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

                    {resultEntries.length > 0 ? (
                      <div className="grid grid-cols-1 gap-1 text-center">
                        {resultEntries.map(([key, value], index) => (
                          <div key={index} className="flex justify-start w-full items-center">
                            <strong className="text-indigo-900">{key}:</strong>
                            <span>{typeof value === 'number' ? (Number.isInteger(value) ? value : value.toFixed(2)) : value?.toString() || 'ไม่มีข้อมูล'}</span>
                          </div>
                        ))}

                        {/* Note section */}
                        <div className="form-group">
                          <div className="flex justify-center items-center space-x-2">
                            <label className="font-bold">Note</label>
                            {isEditing ? (
                              <>
                                <button
                                  onClick={handleSaveNote}
                                  className="text-green-500 hover:text-green-700"
                                >
                                  <SaveOutlined style={{ fontSize: '18px' }} />
                                </button>
                                <button
                                  onClick={handleCancel}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <CloseOutlined style={{ fontSize: '18px' }} />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setIsEditing(true)}
                                className="text-indigo-500 hover:text-indigo-700"
                              >
                                <EditOutlined style={{ fontSize: '18px' }} />
                              </button>
                            )}
                          </div>
                          {isEditing ? (
                            <textarea
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                          ) : (
                            <p className="text-left">{savedNote || 'ไม่มีบันทึก'}</p>
                          )}
                        </div>

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
        </div>
      </div>
      <MiniFooter />
    </>
  );
};

export default PredictionResultPage;
