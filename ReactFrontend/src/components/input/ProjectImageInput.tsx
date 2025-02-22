import { Button } from '@mui/material';
import React from 'react'

interface ProjectImageInputProps {
    image: File | null;
    setImage: (image: File | null) => void;
    handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
    handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  }
  
const ProjectImageInput: React.FC<ProjectImageInputProps> = ({
    image,
    setImage,
    handleFileSelect,
    handleDrop,
    handleDragOver
  }) => {
    return (
      <>
 {image ? (
        <div className="flex flex-col items-center">
          {/* Container ของรูป */}
          <div className="relative text-center my-2 flex flex-col items-center w-fit h-fit justify-center group border-2 rounded-[5px]">
          {/* Overlay แก้ไขรูป */}
            <div
              onClick={() => {
                document.getElementById("file-upload-edit")?.click();
              }}
              className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-[5px] 
                         opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <i className="bi bi-pencil-fill text-white text-2xl" />
            </div>

            {/* ไอคอนมุมล่าง */}
            <div className="absolute bottom-[-1rem] right-[-1rem] bg-gray-600 text-white rounded-full h-8 w-8 flex items-center justify-center p-1">
              <i className="bi bi-image" />
            </div>

            {/* แสดงรูป */}
            <img
              src={URL.createObjectURL(image)}
              alt="Uploaded"
              className="object-cover w-full h-auto"
            />

            {/* Input file (hidden) สำหรับแก้ไขรูป */}
            <input
              id="file-upload-edit"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* ปุ่ม Change / Remove */}
          <div className="flex justify-center space-x-2 mt-2">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#4f46e5",
                "&:hover": { backgroundColor: "#3730a3" },
              }}
              onClick={() => {
                document.getElementById("file-upload-edit")?.click();
              }}
            >
              <i className="bi bi-pencil-fill mr-1" />
              Change
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setImage(null);
              }}
            >
              <i className="bi bi-trash-fill mr-1" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
         <label
                htmlFor="file-upload"
                className="flex flex-col my-2 items-center justify-center 
                          p-6 border-2 border-dashed border-gray-500 rounded-lg 
                          w-full max-w-[400px] min-h-[300px] bg-gray-50 cursor-pointer"
              >
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="flex flex-col items-center justify-center text-center w-full h-full"
            >
              <i className="bi bi-image text-gray-500 text-4xl mb-4" />
              <p className="text-gray-500">ยังไม่มีรูปปก project</p>
              <p className="text-gray-500">กดเพื่อเลือก หรือ ลากไฟล์มาวางที่นี่</p>
            </div>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
      )}
      </>
    );
    };
    

export default ProjectImageInput