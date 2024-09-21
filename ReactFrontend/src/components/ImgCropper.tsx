import React, { useState, useRef } from 'react';
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
    const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined); // เริ่มต้นไม่มีอัตราส่วน (free aspect ratio)
    const [completedCrop, setCompletedCrop] = useState<Crop | null>(crop);
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
          onCropDone(croppedImageUrl); // ส่งค่า URL ที่ครอบออกไป
        }
      };

  const handleAspectRatioChange = (ratio: number | undefined) => {
    setAspectRatio(ratio);
  };
  return (
    <div className="w-full flex  items-center space-y-4  ">
        <div className="relative w-[50%] h-[350px] mx-auto  ">
     

      <ReactCrop
        crop={crop}
        onChange={(newCrop) => setCrop(newCrop)}
        onComplete={(c) => setCompletedCrop(c)}
        aspect={aspectRatio} // กำหนดอัตราส่วนที่นี่
      >
        <img src={src} onLoad={(e) => onLoad(e.currentTarget)} alt="Crop me" 
        //    style={{ maxWidth: "450px", maxHeight: "450px",  minWidth:"450px" ,minHeight:"450px"}}
        />
      </ReactCrop>
        </div>
      <div className='w-[40%]  px-4'>  
        
      <div className="py-4">
                            <p className="text-2xl">Flip Image</p>
                            <hr className="my-2"></hr>
                            <div className=" flex gap-10 py-4 ">
        <div className="w-full flex gap-2 flex-wrap px-4">
            <button 
            className="flex items-center justify-center w-[30%] max-w-[30%] h-10 rounded-lg border border-gray-300   hover:bg-gray-100 cursor-pointer  hover:text-blue-700"       
            onClick={() => handleAspectRatioChange(undefined)}>ค่าเริ่มต้น</button>
            <button 
            className="flex items-center justify-center w-[30%] max-w-[30%] h-10 rounded-lg border border-gray-300   hover:bg-gray-100 cursor-pointer  hover:text-blue-700"
            onClick={() => handleAspectRatioChange(1 / 1)}>1:1</button>
            <button
            className="flex items-center justify-center w-[30%] max-w-[30%] h-10 rounded-lg border border-gray-300   hover:bg-gray-100 cursor-pointer  hover:text-blue-700"
            onClick={() => handleAspectRatioChange(5 / 4)}>16:9</button>
            <button 
            className="flex items-center justify-center w-[30%] max-w-[30%] h-10 rounded-lg border border-gray-300   hover:bg-gray-100 cursor-pointer  hover:text-blue-700"
            onClick={() => handleAspectRatioChange(4 / 3)}>9:16</button>
             <button 
            className="flex items-center justify-center w-[30%] max-w-[30%] h-10 rounded-lg border border-gray-300   hover:bg-gray-100 cursor-pointer  hover:text-blue-700"
            onClick={() => handleAspectRatioChange(3 / 2)}>5:4</button>
             <button 
            className="flex items-center justify-center w-[30%] max-w-[30%] h-10 rounded-lg border border-gray-300   hover:bg-gray-100 cursor-pointer  hover:text-blue-700"
            onClick={() => handleAspectRatioChange(16 / 9)}>4:5</button>
   
        </div>
        </div>
        </div>
        <div className="w-full flex justify-center mt-4  gap-4">
            <button onClick={onCancel} className="bg-gray-200 p-2 rounded bg w-full ">
            Cancel
            </button>
            <button onClick={handleSave}  className="bg-blue-500 text-white p-2 rounded w-full">
            Save
            </button>
        </div>

 
      </div>
    </div>
  );
};

export default ImgCropper;
