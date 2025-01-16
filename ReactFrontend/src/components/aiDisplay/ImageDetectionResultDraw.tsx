import { Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

interface ObjectDetection {
  position: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  label: string;
  confidence: number;
}
interface SegmentationDetection {
  label: string;
  polygon: [number, number][];
}

interface ImageDetectionResultDrawProps {
  aiDisplayType: string; 
  detections: ObjectDetection[] | SegmentationDetection[] | null;
  InputImage: string;
}


// component สำหรับวาดผลลัพธ์การตรวจจับวัตถุ
const ImageDetectionResultDraw: React.FC<ImageDetectionResultDrawProps> = ({ detections, InputImage ,  aiDisplayType,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showAnnotations, setShowAnnotations] = useState(true);

 
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const image = new Image();
    image.src = InputImage;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);

      if (showAnnotations && detections) {
        if (aiDisplayType === 'objectdetection') {
          // วาด Bounding Boxes
          (detections as ObjectDetection[]).forEach((detection) => {
            const confidence = detection.confidence.toFixed(2); 
            const labelText = `${detection.label} (${confidence})`;
            const { x1, y1, x2, y2 } = detection.position;
            context.beginPath();
            context.rect(x1, y1, x2 - x1, y2 - y1);
            context.lineWidth = 2;
            context.strokeStyle = 'red';
            context.fillStyle = 'rgba(255, 0, 0, 0.2)';
            context.fill();
            context.stroke();
            context.font = '30px Arial';
            context.fillStyle = 'red';
            context.fillText(labelText, x1, y1 - 5); // แสดงข้อความรวม confidence

          });
        } else if (aiDisplayType === 'segmentation') {
          const canvasWidth = 1152;
          const canvasHeight = 640;
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        
          const usedPositions: { x: number; y: number }[] = [];
        
          (detections as SegmentationDetection[]).forEach((detection) => {
            const { label, polygon } = detection;
            context.beginPath();
            polygon.forEach(([x, y], index) => {
              if (index === 0) {
                context.moveTo(x, y);
              } else {
                context.lineTo(x, y);
              }
            });
            context.closePath();
            context.fillStyle = 'rgba(255, 0, 0, 0.3)';
            context.strokeStyle = 'red';
            context.lineWidth = 2;
            context.fill();
            context.stroke();
        
            const minY = Math.min(...polygon.map((point) => point[1]));
            let labelX = polygon.find((point) => point[1] === minY)?.[0] || 0;
        
            // ปรับตำแหน่ง Label เพื่อหลีกเลี่ยงการทับซ้อน
            let labelY = minY - 5;
            for (const pos of usedPositions) {
              if (Math.abs(pos.x - labelX) < 50 && Math.abs(pos.y - labelY) < 30) {
                labelY -= 30; // เพิ่ม Offset หากทับซ้อน
              }
            }
        
            usedPositions.push({ x: labelX, y: labelY });
        
            context.font = '25px Arial';
            context.fillStyle = 'red';
            context.fillText(label, labelX, labelY);
          });
        }
        
        
        
      }
    };
  }, [InputImage, detections, showAnnotations, aiDisplayType]);


  const toggleAnnotations = () => {
    setShowAnnotations(!showAnnotations);
  };

  return (
    <div className="w-full text-center space-y-2 border rounded-[5px] p-10 justify-center">
      <div className="w-full flex justify-end py-1">
      <Button
          onClick={toggleAnnotations}
          variant="contained"
          size="large"
          sx={{
            backgroundColor: '#4f46e5',
            '&:hover': {
              backgroundColor: '#3730a3',
            },
          }}
        >
          {showAnnotations ? 'Hide Annotations' : 'Show Annotations'}
        </Button>
      </div>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          style={{
            width: '',
            height: '',
            maxWidth: '1600px',
            maxHeight: '450px',
            minWidth: '150px',
            minHeight: '150px',
          }}
        />
      </div>
          {/* <pre> {JSON.stringify(detections, null, 2)} </pre> */}
    </div>
  );
};

export default ImageDetectionResultDraw;
