import React, { useRef, useEffect, useState } from "react";
import { PictureOutlined } from "@ant-design/icons";
import { Button } from "@mui/material";

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
  regression_params?: any | null;
  response_keys?: { key: string; meaning: string }[];
}

interface DemoPredictResultProps {
  predictResult: PredictResult;
  resultImage: string;
}

const ObjectDetectionOverlay: React.FC<DemoPredictResultProps> = ({
  predictResult,
  resultImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showBoxes, setShowBoxes] = useState(true);

  const getMeaningForKey = (key: string) => {
    const keyWithMeaning = predictResult.response_keys?.find(
      (item) => item.key === key
    );
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
          context.fillText(detection.label, detection.x1, detection.y1 - 12);
        });
      }
    };
  }, [resultImage, predictResult, showBoxes]);

  const toggleBoxes = () => {
    setShowBoxes(!showBoxes);
  };

  return (
    <div className="w-full">
      <div className="flex w-full ">
        <div className="w-[100%] text-center space-y-2 border rounded-[5px] p-10 justify-center">
          <div className="w-full flex justify-end py-1">
            <Button
              onClick={toggleBoxes}
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#4f46e5",
                "&:hover": {
                  backgroundColor: "#3730a3", // สีที่ต้องการเมื่อ hover
                },
              }}
            >
              {showBoxes ? (
                <>
                  <i className="bi bi-eye"></i>Hide
                </>
              ) : (
                <>
                  <i className="bi bi-eye-slash"></i> Show
                </>
              )}{" "}
              Bounding Boxes
            </Button>
          </div>
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: "auto",
              maxWidth: "1600px",
              maxHeight: "450px",
              minWidth: "150px",
              minHeight: "150px",
            }}
          />
        </div>
      </div>
      <div className="w-[100%] border rounded-[5px] p-10">
        <div className="flex justify-start items-center p-0 space-x-4">
          <PictureOutlined style={{ fontSize: "32px", color: "#4f46e5" }} />
          <h1 className="text-3xl font-medium tracking-tight text-indigo-900 mb-0">
            Image Name
          </h1>
        </div>
        <div className="flex justify-start items-center p-0 space-x-4">
          <span className="text-gray-600 text-lg">AI Name</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-400 text-lg">{predictResult.ai_type}</span>
        </div>
        <div className="flex justify-start mb-2 mt-4">
          <span className="w-fit bg-indigo-600 rounded-[5px] me-2 px-2.5 py-0.5 text-white text-lg font-normal">
            tag1
          </span>
          <span className="w-fit bg-indigo-600 rounded-[5px] me-2 px-2.5 py-0.5 text-white text-lg font-normal">
            tag2
          </span>
          <span className="w-fit bg-indigo-600 rounded-[5px] me-2 px-2.5 py-0.5 text-white text-lg font-normal">
            tag3
          </span>
        </div>
        <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto" />
        <div className="py-4">
          <h4 className="text-2xl">
            <i className="bi bi-clipboard-check-fill text-blue-600 mr-2"></i>{" "}
            ผลลัพธ์การทำนาย
          </h4>
          <table className="min-w-full mt-4 bg-white rounded-lg shadow">
            <tbody>
              {predictResult.prediction.detections.length > 0 ? (
                predictResult.prediction.detections.map((detection, index) => (
                  <tr key={index} className="bg-gray-100 border-b">
                    {" "}
                    <th className="py-3 px-4 text-indigo-800 text-2xl font-medium">
                      {" "}
                      {getMeaningForKey("detections") + ' '+(index + 1)}
                    </th>{" "}
                    <td className="py-3 px-4 text-gray-800 text-xl">
                      <text className="py-3 px-4 text-indigo-600 text-xl font-medium">Label:</text>
                      {` ${detection.label}
                      `}
                    </td>
                    <td className="py-3 px-4 text-gray-800 text-xl">
                    <text className="py-3 px-4 text-indigo-600 text-xl font-medium">Confidence:</text>
                      {`
                       ${detection.confidence.toFixed(2)}`}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  {" "}
                  <td colSpan={2} className="text-center py-4">
                    {" "}
                    ไม่มีข้อมูล{" "}
                  </td>{" "}
                </tr>
              )}
            </tbody>
          </table>

          {predictResult.regression_params && (
            <p>
              Regression Params:{" "}
              {JSON.stringify(predictResult.regression_params)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObjectDetectionOverlay;
