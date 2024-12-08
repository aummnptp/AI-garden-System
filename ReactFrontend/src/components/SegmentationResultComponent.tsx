import React, { useRef, useEffect, useState } from "react";
import { Button } from "@mui/material";

interface SegmentationDetection {
  label: string;
  coordinates: { x: number; y: number }[];
}

interface PredictResult {
  ai_type: string;
  prediction: { detections: SegmentationDetection[] };
}

interface DemoPredictResultProps {
  predictResult: PredictResult;
  resultImage: string;
}

const SegmentationResultComponent: React.FC<DemoPredictResultProps> = ({
  predictResult,
  resultImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showSegments, setShowSegments] = useState(true);

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

      if (showSegments) {
        predictResult.prediction.detections.forEach((detection) => {
          context.beginPath();

          // Extract coordinates from response
          const points = Object.keys(detection)
            .filter(key => key.startsWith('x') || key.startsWith('y'))
            .reduce((acc, key) => {
              const index = key.match(/\d+/)[0];
              acc[index] = { ...acc[index], [key.startsWith('x') ? 'x' : 'y']: detection[key] };
              return acc;
            }, [])
            .map(point => ({ x: point.x, y: point.y }));

          points.forEach((point, index) => {
            if (index === 0) {
              context.moveTo(point.x, point.y);
            } else {
              context.lineTo(point.x, point.y);
            }
          });

          context.closePath();
          context.fillStyle = "rgba(0, 255, 0, 0.2)";
          context.fill();
          context.lineWidth = 2;
          context.strokeStyle = "green";
          context.stroke();

          context.font = "20px Arial";
          context.fillStyle = "green";
          context.fillText(detection.label, points[0].x, points[0].y - 5);
        });
      }
    };
  }, [resultImage, predictResult, showSegments]);

  const toggleSegments = () => {
    setShowSegments(!showSegments);
  };

  return (
    <div className="w-full">
      <div className="flex justify-end py-2">
        <Button
          onClick={toggleSegments}
          variant="contained"
          size="medium"
          sx={{
            backgroundColor: "#4f46e5",
            "&:hover": { backgroundColor: "#3730a3" },
          }}
        >
          {showSegments ? "Hide Segmentation" : "Show Segmentation"}
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "auto",
          maxWidth: "800px",
          maxHeight: "600px",
        }}
      />
    </div>
  );
};

export default SegmentationResultComponent;
