import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MiniFooter from '../components/MiniFooter';
import Sidebar from "../components/Sidebar";
import ProjectData from "../data/ProjectData";
import { Button } from '@mui/material';

const PredictAiModelPage: React.FC = () => {
  const { workspaceId, projectId } = useParams<{ workspaceId?: string, projectId?: string }>();
  const { modelId } = useParams<{ modelId: string }>();
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFileUrl(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      console.log(file.size);
      try {
        const response = await fetch(`http://localhost:5000/predict/${modelId}`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();

          // ดึงค่า prediction, regression_params และ ai_type จาก data
          const { prediction, regression_params, ai_type, response_keys } = data;

          navigate(`/workspaces/${workspaceId}/project/${projectId}/detail/test/${modelId}/result`, {
            state: {
              prediction: prediction,   // ผลลัพธ์การพยากรณ์
              regression_params: regression_params,  // ค่า regression_params สำหรับพล็อตกราฟ
              ai_type: ai_type,         // ประเภท AI เพื่อใช้แสดงผล
              file: fileUrl,            // ไฟล์ที่อัปโหลด
              fileName: file.name,
              response_keys: response_keys       // ชื่อไฟล์ที่อัปโหลด
            }
          });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        <Sidebar />

        <div className="w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32 h-full min-h-screen">
          <div className="mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative">
            <div className="flex justify-between items-center p-5">
              <h1 className="text-3xl font-medium tracking-tight text-indigo-900 ">
                {detail.inputType === 'รูปภาพ' ? 'Upload Image' : 'Upload Video'}
              </h1>
            </div>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>
            <form onSubmit={handleSubmit} className="m-6 space-y-4">
              <div className="form-group">
                <label>{detail.inputType === 'รูปภาพ' ? 'อัปโหลดไฟล์ภาพที่นี่' : 'อัปโหลดไฟล์วิดีโอที่นี่'}</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  accept={detail.inputType === 'รูปภาพ' ? 'image/*' : 'video/*'}
                />
              </div>
              {fileUrl && (
                <div className="w-1/2 mx-auto mt-4">
                  {detail.inputType === 'รูปภาพ' ? (
                    <img src={fileUrl} alt="Preview" className="w-full h-auto" />
                  ) : (
                    <video controls className="w-full">
                      <source src={fileUrl} type="video/mp4" />
                      <source src={fileUrl} type="video/webm" />

                      <p>เบราว์เซอร์ของคุณไม่รองรับการแสดงวิดีโอ <a href={fileUrl}>ดาวน์โหลดวิดีโอที่นี่</a>.</p>
                    </video>
                  )}
                </div>
              )}

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
                  ยืนยัน
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <MiniFooter />
    </>
  );
};

export default PredictAiModelPage;
