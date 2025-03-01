import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";

interface AiPictureInputProps {
  image?: File;
  imagePreview?: string |null;
  setImage: (file?: File) => void;
  setImagePreview?: (url: string | null) => void;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  errorMessage?: string;
}

const AiPictureInput: React.FC<AiPictureInputProps> = ({
  image,
  imagePreview,
  handleFileSelect,
  handleDrop,
  handleDragOver,
  errorMessage,
}) => {
  const [displayImage, setDisplayImage] = useState<string | undefined>(() => imagePreview ?? undefined);

  useEffect(() => {
    if (image) {
      setDisplayImage(URL.createObjectURL(image));
    } else if (imagePreview) {
      setDisplayImage(imagePreview);
    } else {
      setDisplayImage(undefined);
    }
  }, [image, imagePreview]);

  return (
    <div className="form-group flex flex-col items-center">
      <label className="font-medium text-lg justify-start ">AI Picture</label>
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

      {displayImage ? (
        <div className="flex flex-col items-center">
          <div className="relative text-center my-2 flex flex-col items-center w-fit h-fit justify-center group border-2 rounded-lg">
            <div
              onClick={() => document.getElementById("ai-file-upload")?.click()}
              className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg
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
              key={displayImage}
              src={displayImage}
              alt="AI Preview"
              className="object-cover w-full h-auto max-w-[400px] max-h-[300px] rounded-lg border"
              onError={() => setDisplayImage(undefined)}
            />

            {/* Input file (hidden) */}
            <input
              id="ai-file-upload"
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
              onClick={() => document.getElementById("ai-file-upload")?.click()}
            >
              <i className="bi bi-pencil-fill mr-1" />
              Change
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <label
            htmlFor="ai-file-upload"
            className="flex flex-col items-center justify-center 
                      p-6 border-2 border-dashed border-gray-500 rounded-lg 
                      w-full max-w-[400px] min-h-[300px] bg-gray-50 cursor-pointer"
          >
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="flex flex-col items-center justify-center text-center w-full h-full"
            >
              <i className="bi bi-image text-gray-500 text-4xl mb-4" />
              <p className="text-gray-500">ยังไม่มีรูป AI</p>
              <p className="text-gray-500">กดเพื่อเลือก หรือ ลากไฟล์มาวางที่นี่</p>
            </div>
            <input
              id="ai-file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default AiPictureInput;