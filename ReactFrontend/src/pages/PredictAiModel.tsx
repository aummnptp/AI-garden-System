import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MiniFooter from '../components/MiniFooter';

const PredictAiModel: React.FC = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
  
      fetch(`http://localhost:5000/predict/${modelId}`, {
        method: 'POST',
        body: formData,
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const reader = new FileReader();
          reader.onloadend = () => {
            console.log("FileReader result:", reader.result); // ตรวจสอบค่า
            navigate('/admin/predict/result', {
              state: {
                prediction: data,
                image: reader.result as string,
                fileName: file.name // เพิ่มชื่อไฟล์
              }
            });
          };
          reader.readAsDataURL(file); // แปลงไฟล์เป็น base64 string
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  };

  return (
    <>
      <div className="flex bg-neutral-100 h-full pb-32">
        <div className="w-1/5 bg-neutral-200 h-full"></div>
        <div className="w-4/5 items-center justify-center h-full grid grid-cols-1">
          <div className="mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative">
            <div className="flex justify-between items-center p-5">
              <h1 className="text-3xl font-medium tracking-tight text-indigo-900 dark:text-black">
                ใช้งานโปรเจค AI
              </h1>
            </div>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>
            <form onSubmit={handleSubmit} className="m-6 space-y-4">
              <div className="form-group">
                <label>อัปโหลดไฟล์ภาพที่นี่</label>
                <input type="file" onChange={handleFileChange} className="w-full p-2 border border-gray-300 rounded-lg" />
              </div>
              <button type="submit" className="p-2 bg-blue-500 text-white rounded">
                ทำนาย
              </button>
            </form>
          </div>
        </div>
      </div>
      <MiniFooter />
    </>
  );
};

export default PredictAiModel;
