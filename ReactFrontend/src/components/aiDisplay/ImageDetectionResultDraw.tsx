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
  polygons: [number, number][][];
}

interface ImageDetectionResultDrawProps {
  aiDisplayType: string; 
  detections: ObjectDetection[] | SegmentationDetection[] | null;
  InputImage: string;
  colorSet: string[];

}

const hexToRgba = (hex: string, alpha: number): string => {
  let c: any;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return "rgba(" + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") + `,${alpha})`;
  }
  return hex;
};


const ImageDetectionResultDraw: React.FC<ImageDetectionResultDrawProps> = ({ detections, InputImage ,  aiDisplayType, colorSet,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showAnnotations, setShowAnnotations] = useState(true);

 
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const image = new Image();
    image.src = InputImage;
    image.onload = () => {

      if (aiDisplayType === "segmentation") {
        const canvasWidth = image.width;
        const canvasHeight = image.height;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
      } else {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
      }

      if (showAnnotations && detections) {
        if (aiDisplayType === "objectdetection") {

          (detections as ObjectDetection[]).forEach((detection, index) => {
            const confidence = detection.confidence.toFixed(2);
            const labelText = `${index + 1}. ${detection.label} (${confidence})`;
            const { x1, y1, x2, y2 } = detection.position;


            const color =
              colorSet && colorSet.length > 0
                ? colorSet[index % colorSet.length]
                : "00ff00";

            // color fill alpha (0.2)
            const fillColor = hexToRgba(color, 0.2);

            context.beginPath();
            context.rect(x1, y1, x2 - x1, y2 - y1);
            context.lineWidth = 2;
            context.strokeStyle = color;
            context.fillStyle = fillColor;
            context.fill();
            context.stroke();
            context.font = "30px Arial";
            context.fillStyle = color;
            context.fillText(labelText, x1, y1 - 5);
          });
        } else if (aiDisplayType === "segmentation") {

          const canvasWidth = image.width;
          const canvasHeight = image.height;
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
  
          (detections as SegmentationDetection[]).forEach((detection, index) => {
            const { label, polygons } = detection;
          
            const color = colorSet && colorSet.length > 0 ? colorSet[index % colorSet.length] : "#00ff00";
            const fillColor = hexToRgba(color, 0.3);
          
            polygons.forEach((polygon: [number, number][]) => {
              context.beginPath();
              polygon.forEach(([x, y]: [number, number], idx: number) => {
                if (idx === 0) {
                  context.moveTo(x, y);
                } else {
                  context.lineTo(x, y);
                }
              });
              context.closePath();
              context.fillStyle = fillColor;
              context.strokeStyle = color;
              context.lineWidth = 2;
              context.fill();
              context.stroke();
            });
          
            //  label
            const allPoints: [number, number][] = polygons.flat();
            const minY = Math.min(...allPoints.map((point: [number, number]) => point[1]));
            const labelPoint = allPoints.find((point: [number, number]) => point[1] === minY) || [0, 0];
            const [labelX, labelY] = labelPoint;
          
            context.font = "25px Arial";
            context.fillStyle = color;
            context.fillText(`${index + 1}. ${label}`, labelX, labelY - 5);
          });
        }
      }

    };
  }, [InputImage, detections, showAnnotations, aiDisplayType, colorSet]);


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
    </div>
  );
};

export default ImageDetectionResultDraw;
