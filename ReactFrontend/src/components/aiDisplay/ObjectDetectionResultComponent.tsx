import React, { useRef, useEffect, useState } from "react";
import { PictureOutlined } from "@ant-design/icons";
import { Button } from "@mui/material";
import ObjectDetectionDraw from "./ObjectDetectionDraw";
import TextResultDisplay from "./TextResultDisplay";

interface Detection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  confidence: number;
  label: string;
}

interface PredictResult {
  ai_type: string;
  prediction: { detections: Detection[] };
  // regression_params?: any | null;
  response_keys?: { key: string; meaning: string }[];
}

interface DemoPredictResultProps {
  predictResult: PredictResult;
  resultImage: string;
}

const ObjectDetectionResultComponent: React.FC<DemoPredictResultProps> = ({
  predictResult,
  resultImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showBoxes, setShowBoxes] = useState(true);

  const getMeaningForKey = (key: string) => {
    const keyWithMeaning = predictResult.response_keys?.find(
      (item) => item.key === key
    );
    console.log("key",keyWithMeaning)
    return keyWithMeaning ? keyWithMeaning.meaning : key; // Use key itself if no meaning is found
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const image = new Image();
    image.src = resultImage;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);

      if (showBoxes) {
        predictResult.prediction.detections.forEach((detection) => {
          context.beginPath();
          context.rect(
            // ตำแหน่งวาด x,y เริ่ม
            detection.x1,
            detection.y1,
             // ตำแหน่งวาด x,y จบ
            detection.x2 - detection.x1,
            detection.y2 - detection.y1
          );
          // ตั้งค่าความกรอ
          context.lineWidth = 2;
          context.strokeStyle = "red";
          context.fillStyle = "rgba(255, 0, 0, 0.2)";
          context.fill();
          context.stroke();

          context.font = "30px Kanit";
          context.fillStyle = "red";
          context.fillText  (`${detection.label}`+`${detection.confidence}`, detection.x1, detection.y1 - 12, detection.confidence);
        });
      }
    };
  }, [resultImage, predictResult, showBoxes]);
  
  const toggleBoxes = () => {
    setShowBoxes(!showBoxes);
  };
  
  return (
    <div className="w-full">
      <div className="flex w-full  ">
        {/* โซนแสดงภาพ */}
      <ObjectDetectionDraw detections={predictResult.prediction.detections} InputImage={resultImage}/>
      </div>
      <TextResultDisplay predictResult={predictResult} />
 
      <div className="flex justify-center">
      </div>
    </div>
  );
};

export default ObjectDetectionResultComponent;
