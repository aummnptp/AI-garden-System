import { Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'

interface Objectdetection{
    x1:number;
    y1:number;
    x2:number;
    y2:number;
    label:string;
    confidence:number;
}

interface ObjectDetectionDrawProps{
    detections: Objectdetection[];
    InputImage: string;
}


const ObjectDetectionDraw: React.FC<ObjectDetectionDrawProps> = ({detections,InputImage}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const[showBoxes ,setShowBoxes]= useState(true)


    useEffect(()=>{
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        const image = new Image(); 
        image.src = InputImage;
        image.onload = ()=>{
        canvas.width = image.width; 
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

         if (showBoxes) {
            detections.forEach((detection) => {
                 context.beginPath(); 
                 context.rect( 
                    // จุดเริ่มวาดกรอบ
                    detection.x1, detection.y1,
                    // จุดจบกรอบ
                    detection.x2 - detection.x1, detection.y2 - detection.y1
                );
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
}, [InputImage, detections, showBoxes]); // ใส่ dependencies ที่เกี่ยวข้อง

    const toggleBoxes = () => { setShowBoxes(!showBoxes); };
  return (
    <div className="w-full text-center space-y-2 border rounded-[5px] p-10 justify-center">
      <div className="w-full flex justify-end py-1">
        <Button
          onClick={toggleBoxes}
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "#4f46e5",
            "&:hover": {
              backgroundColor: "#3730a3",
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
      <div className='flex justify-center'>
      <canvas
        ref={canvasRef}
        style={{
          width: "",
          height: "",
          maxWidth: "1600px",
          maxHeight: "450px",
          minWidth: "150px",
          minHeight: "150px",
        }}
        />
      </div>
   
    </div>




    
  )
}

export default ObjectDetectionDraw
