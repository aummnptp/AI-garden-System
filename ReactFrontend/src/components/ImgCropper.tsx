import { Button } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImgCropperProps {
  src: string; // URL ของภาพ
  onCropDone: (croppedImageUrl: string) => void; 
  onCancel: () => void;
}

const ImgCropper: React.FC<ImgCropperProps> = ({ src , onCropDone,onCancel}) => {
    const [crop, setCrop] = useState<Crop>({
        unit: 'px', 
        width: 250,
        height: 250,
        x: 0,
        y: 0,
      });
    const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined); 
    const [completedCrop, setCompletedCrop] = useState<Crop | null>(crop);
    const [imageWidth, setImageWidth] = useState<number | null>(null);
    const [imageHeight, setImageHeight] = useState<number | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
 

    const onLoad = (img: HTMLImageElement) => {
        imgRef.current = img;
      };

      // ฟังก์ชันสำหรับสร้างภาพครอบ
      const generateCroppedImage = (image: HTMLImageElement, crop: Crop) => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width! * scaleX;
        canvas.height = crop.height! * scaleY;
        const ctx = canvas.getContext('2d');
    
        if (!ctx) {
          return;
        }
    
        // วาดภาพที่ถูกครอบลงใน canvas
        ctx.drawImage(
          image,
          crop.x! * scaleX,
          crop.y! * scaleY,
          crop.width! * scaleX,
          crop.height! * scaleY,
          0,
          0,
          crop.width! * scaleX,
          crop.height! * scaleY
        );
  

        // แปลง canvas เป็น Data URL
        
        return canvas.toDataURL('image/png');
      };
    
    const handleSave = () => {
        if (!completedCrop || !imgRef.current) {
          return;
        }
    
        const croppedImageUrl = generateCroppedImage(imgRef.current, completedCrop);
        if (croppedImageUrl) {
          onCropDone(croppedImageUrl); 
        }
      };

      useEffect(() => {
        if (completedCrop && imgRef.current) {
          const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
          const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
  
        setImageWidth(Math.round(completedCrop.width! * scaleX));
        setImageHeight(Math.round(completedCrop.height! * scaleY));
        }
      }, [completedCrop]);

      const handleAspectRatioChange = (ratio: number | undefined) => {
        setAspectRatio(ratio);
      };
  
  return (
    <div className="w-full flex  items-center space-y-4  ">
      <div className="relative w-[50%] mx-auto   h-fit  flex items-center justify-center  py-10">
        <ReactCrop
          crop={crop}
          onChange={(newCrop) => setCrop(newCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspectRatio} 
        >
          <img
            src={src}
            onLoad={(e) => onLoad(e.currentTarget)}
            style={{
              maxWidth: "450px",
              maxHeight: "450px",
              minWidth: "150px",
              minHeight: "150px",
            }}
            alt="Crop me"
          />
        </ReactCrop>
      </div>

      <div className="w-[40%]  px-4 border p-6 rounded-[5px]">
        <div className="">
          <p className="text-2xl">Crop Ratio</p>
          <hr className="my-2"></hr>
          {imageWidth != null && imageHeight != null && (
          <div>
          <span className="text-xl bg-slate-100 text-indigo-600 font-medium rounded-md w-fit px-4  my-4">
            width:{imageWidth} (px)
          </span>
          <span className="mx-2">x</span>
          <span className="text-xl bg-slate-100 text-indigo-600 font-medium rounded-md w-fit px-4  my-4">
            height:
            {imageHeight} (px)
          </span>
          </div>
        )}
          <div className=" flex gap-10 py-4 ">
            <div className="w-full flex gap-2 flex-wrap px-4">
              <button
                className={`flex items-center justify-center w-[30%] max-w-[30%] h-10 rounded-lg border ${
                  aspectRatio === undefined
                    ? "border-blue-700 text-blue-700"
                    : "border-gray-300"
                } hover:bg-gray-100 cursor-pointer hover:text-blue-700`}
                onClick={() => handleAspectRatioChange(undefined)}
              >
                กำหนดเอง
              </button>
              <button
                className={`flex items-center justify-center w-[30%] max-w-[30%] h-10 rounded-lg border ${
                  aspectRatio === 1 / 1
                    ? "border-blue-700 text-blue-700"
                    : "border-gray-300"
                } hover:bg-gray-100 cursor-pointer hover:text-blue-700`}
                onClick={() => handleAspectRatioChange(1 / 1)}
              >
                1:1
              </button>
              <button
                className={`flex items-center justify-center w-[30%] max-w-[30%] h-10 rounded-lg border ${
                  aspectRatio === 16 / 9
                    ? "border-blue-700 text-blue-700"
                    : "border-gray-300"
                } hover:bg-gray-100 cursor-pointer hover:text-blue-700`}
                onClick={() => handleAspectRatioChange(16 / 9)}
              >
                16:9
              </button>
              <button
                className={`flex items-center justify-center w-[30%] max-w-[30%] h-10 rounded-lg border ${
                  aspectRatio === 9 / 16
                    ? "border-blue-700 text-blue-700"
                    : "border-gray-300"
                } hover:bg-gray-100 cursor-pointer hover:text-blue-700`}
                onClick={() => handleAspectRatioChange(9 / 16)}
              >
                9:16
              </button>
              <button
                className={`flex items-center justify-center w-[30%] max-w-[30%] h-10 rounded-lg border ${
                  aspectRatio === 5 / 4
                    ? "border-blue-700 text-blue-700"
                    : "border-gray-300"
                } hover:bg-gray-100 cursor-pointer hover:text-blue-700`}
                onClick={() => handleAspectRatioChange(5 / 4)}
              >
                5:4
              </button>
              <button
                className={`flex items-center justify-center w-[30%] max-w-[30%] h-10 rounded-lg border ${
                  aspectRatio === 4 / 5
                    ? "border-blue-700 text-blue-700"
                    : "border-gray-300"
                } hover:bg-gray-100 cursor-pointer hover:text-blue-700`}
                onClick={() => handleAspectRatioChange(4 / 5)}
              >
                4:5
              </button>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center mt-4  gap-4">
          <Button
            variant="outlined"
            onClick={onCancel}
            className="bg-gray-200 p-2 rounded bg w-full "
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: "#4f46e5",
              "&:hover": { backgroundColor: "#3730a3" },
            }}
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImgCropper;
