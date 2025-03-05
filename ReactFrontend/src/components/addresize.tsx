import { Button, TextField } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';

interface ImageUploaderProps {
  image: File;
}

const ImageUploaderRetest: React.FC<ImageUploaderProps> = ({ image }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0); 
  const [isGrayscale, setIsGrayscale] = useState<boolean>(false);
  const [resizeWidth, setResizeWidth] = useState<number>(300);
  const [resizeHeight, setResizeHeight] = useState<number>(300);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleRotateLeft = () => {
    setRotation((prev) => prev - 90);
  };

  const handleRotateRight = () => {
    setRotation((prev) => prev + 90);
  };

  const toggleGrayscale = () => {
    setIsGrayscale((prev) => !prev);
  };

  const handleResizeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResizeWidth(parseInt(e.target.value, 10));
  };

  const handleResizeHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResizeHeight(parseInt(e.target.value, 10));
  };

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(image); 
    }
  }, [image]);

  useEffect(() => {
    if (selectedImage && canvasRef.current) {
      const image = new Image();
      image.src = selectedImage;
      image.onload = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d');
        
        canvas.width = resizeWidth;
        canvas.height = resizeHeight;

        ctx?.clearRect(0, 0, canvas.width, canvas.height);

        ctx?.save();
        ctx?.translate(canvas.width / 2, canvas.height / 2);
        ctx?.rotate((rotation * Math.PI) / 180); 
        ctx?.drawImage(image, -resizeWidth / 2, -resizeHeight / 2, resizeWidth, resizeHeight);
        ctx?.restore();

        if (isGrayscale) {
          const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
          if (imageData && ctx) {
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
              const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
              data[i] = avg;     // Red
              data[i + 1] = avg; // Green
              data[i + 2] = avg; // Blue
            }
            ctx.putImageData(imageData, 0, 0);
          }
        }

        const downloadUrl = canvas.toDataURL('image/png');
        setDownloadUrl(downloadUrl);
      };
    }
  }, [selectedImage, rotation, isGrayscale, resizeWidth, resizeHeight]);

  return (
    <div className='flex w-full'>
      {selectedImage && (
        <div className="px-10 mx-auto w-full flex items-start  ">
          <div className="px-10 mx-auto h-fit pb-10 ">
            <h3>ผลลัพธ์การปรับแต่ง:</h3>
            <canvas ref={canvasRef} ></canvas>
            {downloadUrl && (
              <div className='pt-4'>
                <div className='py-2'>
                  <Button variant='contained' sx={{ backgroundColor: "#4f46e5", "&:hover": { backgroundColor: "#3730a3", }, }} style={{ marginRight: '0.5rem' }} onClick={handleRotateLeft}>
                    <i className="bi bi-arrow-counterclockwise"></i> หมุนซ้าย (-90°)
                  </Button>
                  <Button variant='contained' sx={{ backgroundColor: "#4f46e5", "&:hover": { backgroundColor: "#3730a3", }, }} onClick={handleRotateRight}>
                    <i className="bi bi-arrow-clockwise"></i> หมุนขวา (+90°)
                  </Button>
                </div>

                <Button variant='contained' sx={{ backgroundColor: "#4f46e5", "&:hover": { backgroundColor: "#3730a3", }, }} style={{ marginRight: '0.5rem' }} onClick={toggleGrayscale}>
                  {isGrayscale ? 'ลบ Grayscale' : 'ปรับ Grayscale'}
                </Button>

                <div className="py-4">
                  {/* Input สำหรับกำหนดขนาดความกว้างและความสูง */}
                  <TextField label="ความกว้าง (px)" type="number" value={resizeWidth} onChange={handleResizeWidthChange} style={{ marginRight: '0.5rem' }} />
                  <TextField label="ความสูง (px)" type="number" value={resizeHeight} onChange={handleResizeHeightChange} />
                </div>

                <Button variant='contained' sx={{ backgroundColor: "#4f46e5", "&:hover": { backgroundColor: "#3730a3", }, }} href={downloadUrl} download="customImage.png">
                  <i className="bi bi-download"></i> ดาวน์โหลด รูปภาพ
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploaderRetest;
