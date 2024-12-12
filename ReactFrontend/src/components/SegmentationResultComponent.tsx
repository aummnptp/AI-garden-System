import React, { useRef, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { PictureOutlined } from "@ant-design/icons";

interface SegmentationDetection {
  label: string;
  polygon: number[][];
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

    const getMeaningForKey = (key: string) => {
      return key === "detections" ? "ผลลัพธ์ที่" : key;
    };

    useEffect(() => {
      if (!canvasRef.current) return;
    
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;
    
      const image = new Image();
      image.src = resultImage;
      image.onload = () => {
        const canvasWidth = 256;
        const canvasHeight = 256;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    
        if (showSegments) {
          predictResult.prediction.detections.forEach((detection) => {
            const { label, polygon } = detection;
    
            context.fillStyle = "rgba(0, 255, 0, 0.3)";
            context.strokeStyle = "green";
            context.lineWidth = 2;
    
            context.beginPath();
            polygon.forEach(([x, y], index) => {
              if (index === 0) {
                context.moveTo(x, y);
              } else {
                context.lineTo(x, y);
              }
            });
            context.closePath();
            context.fill();
            context.stroke();
    
            if (polygon.length > 0) {
              const minY = Math.min(...polygon.map((point) => point[1])); // คำนวณ y ตำแหน่งต่ำสุด
              const labelX = polygon.find((point) => point[1] === minY)[0]; // หาค่า x ที่ตรงกับ y ต่ำสุด
    
              context.font = "20px Arial";
              context.fillStyle = "green";
              context.fillText(label, labelX, minY - 5); // วาง label เหนือจุด y ต่ำสุด
            }
          });
        }
      };
    }, [resultImage, predictResult, showSegments]);
    
    

  // useEffect(() => {
  //   if (!canvasRef.current) return;

  //   const canvas = canvasRef.current;
  //   const context = canvas.getContext("2d");
  //   if (!context) return;

  //   const image = new Image();
  //   image.src = resultImage;
  //   image.onload = () => {
  //     // ตั้งค่าขนาดของ canvas ตามขนาดของ image
  //     // canvas.width = image.width;
  //     // canvas.height = image.height;
  //     canvas.width = 1152;
  //     canvas.height =  640;

  //     context.drawImage(image, 0, 0, image.width, image.height);

  //     if (showSegments) {
  //       // วาดแต่ละ class จากผลการ segmentation
  //       predictResult.prediction.detections.forEach((detection) => {
  //         const { label, polygon } = detection;

  //         // วาด polygon บน canvas
  //         context.fillStyle = "rgba(0, 255, 0, 0.3)"; // สีที่ใช้ในการเติม
  //         context.strokeStyle = "green"; // สีที่ใช้ในการวาดเส้น
  //         context.lineWidth = 2;

  //         context.beginPath();
  //         polygon.forEach(([x, y], index) => {
  //           if (index === 0) {
  //             context.moveTo(x, y);
  //           } else {
  //             context.lineTo(x, y);
  //           }
  //         });
  //         context.closePath();
  //         context.fill();
  //         context.stroke();

  //         // หากต้องการแสดง label
  //         if (polygon.length > 0) {
  //           const [x, y] = polygon[0]; // ใช้พิกัดจุดแรกเป็นตำแหน่ง label
  //           context.font = "20px Arial";
  //           context.fillStyle = "green";
  //           context.fillText(label, x, y - 5);
  //         }
  //       });
  //     }
  //   };
  // }, [resultImage, predictResult, showSegments]);

  const toggleSegments = () => {
    setShowSegments(!showSegments);
  };

  return (
    <div className="w-full">
      <div className="flex w-full">
        <div className="w-[100%] text-center space-y-2 border rounded-[5px] p-10 justify-center">
          <div className="w-[100%] flex justify-end py-1">
            <Button
              onClick={toggleSegments}
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#4f46e5",
                "&:hover": {
                  backgroundColor: "#3730a3",
                },
              }}
            >
              {showSegments ? (
                <>
                  <i className="bi bi-eye"></i>Hide
                </>
              ) : (
                <>
                  <i className="bi bi-eye-slash"></i> Show
                </>
              )}{" "}
              Segments
            </Button>
          </div>
          
          <canvas
          className ="self-center flex mx-auto "
            ref={canvasRef}
            style={{
              width: " 60%",
              height: "auto",
              // maxWidth: "1152px",
              // minWidth: "1152px",
              
            }}
          />
    


        </div>
      <div className="w-[50%] border rounded-[5px] p-10">
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
            <i className="bi bi-clipboard-check-fill text-blue-600 mr-2"></i> ผลลัพธ์การทำนาย
          </h4>
          <table className="min-w-full mt-4 bg-white rounded-lg shadow">
            <tbody>
              {predictResult.prediction.detections.length > 0 ? (
                predictResult.prediction.detections.map((detection, index) => (
                  <tr key={index} className="bg-gray-100 border-b">
                    <th className="py-3 px-4 text-indigo-800 text-2xl font-medium">
                      {getMeaningForKey("detections") + ' ' + (index + 1)}
                    </th>
                    <td className="py-3 px-4 text-gray-800 text-xl">
                      <span className="py-3 px-4 text-indigo-600 text-xl font-medium">Label:</span>
                      {` ${detection.label}`}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center py-4">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
};

export default SegmentationResultComponent;



// export default SegmentationResultComponent;
