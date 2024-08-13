import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MiniFooter from '../components/MiniFooter';
import Sidebar from "../components/Sidebar";

const PredictAiModel: React.FC = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImageUrl(null);
    }
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
          navigate('/workspaces/1/project-list/1/detail/test/1/result', {
            state: {
              prediction: data,
              image: imageUrl,
              fileName: file.name
            }
          });
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  };

  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
      <Sidebar></Sidebar>
        <div className="w-1/5 bg-neutral-200 h-full"></div>
        <div className="w-4/5 items-center justify-center h-full grid grid-cols-1">
          <div className="mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative">
            <div className="flex justify-between items-center p-5">
              <h1 className="text-3xl font-medium tracking-tight text-indigo-900 ">
                Upload Image
              </h1>
            </div>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>
            <form onSubmit={handleSubmit} className="m-6 space-y-4">
              <div className="form-group">
                <label>อัปโหลดไฟล์ภาพที่นี่</label>
                <input type="file" onChange={handleFileChange} className="w-full p-2 border border-gray-300 rounded-lg" />
              </div>
              {imageUrl && <img src={imageUrl} alt="Preview" className="w-1/2 mx-auto mt-4" />}
              <div className="flex justify-end">
              <button type="submit" className="p-2 bg-blue-500 text-white rounded">
                ยืนยัน
              </button></div>
            </form>
          </div>
        </div>
      </div>
      <MiniFooter></MiniFooter>
    </>
  );
};

export default PredictAiModel;
