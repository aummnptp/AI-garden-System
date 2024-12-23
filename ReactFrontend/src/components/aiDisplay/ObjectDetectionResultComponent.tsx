import React from "react";
import ObjectDetectionDraw from "./ImageDetectionResultDraw";
import { ClassNames } from "@emotion/react";
import TextResultDisplay from "./TextResultDisplay";

interface PredictResult {
  ai_type: string;
  prediction: { [key: string]: any };
  response_keys?: { key: string; meaning: string; displayFormat: string }[];
}

interface ObjectDetectionResultComponentProps {
  predictResult: PredictResult;
  resultImage: string;
}

const ObjectDetectionResultComponent: React.FC<ObjectDetectionResultComponentProps> = ({
  predictResult,
  resultImage,
}) => {

  let PredictDrawData = null;
  let ai_text_type = null;
  
  // ถ้าตีย์มี displayFormat data ให้ PredictDrawData = display format data ตัวนั้น
  const searchDrawKey = predictResult.response_keys?.find(
    (responseKey) =>
      responseKey.displayFormat === "objectdetection" || 
      responseKey.displayFormat === "segmentation"
  );
  
  if (searchDrawKey) {
    // กำหนด `ai_text_type` จาก `displayFormat`
    ai_text_type = searchDrawKey.displayFormat;
  
    // แยก key ออกเป็นส่วนย่อย (เช่น detections.position)
    const keyParts = searchDrawKey.key.split(".");
    let data = predictResult.prediction;
  
    // เดินทางไปตาม key เพื่อดึงค่าจาก prediction
    for (const part of keyParts) {
      data = data?.[part];
      if (!data) break;
    }
  
    // กำหนดค่าให้ PredictDrawData
    PredictDrawData = data;
  }
  


  const textKeys = predictResult.response_keys?.filter(
    (responseKey) => responseKey.displayFormat === "text"
  );
  console.log(textKeys)

  // สร้างข้อมูลที่เหมาะสมสำหรับ TextResultDisplay
  const textData = textKeys?.map((textKey) => {
    const keyParts = textKey.key.split(".");
    let data = predictResult.prediction;

    // เดินทางไปตาม key เพื่อดึงค่าจาก prediction
    for (const part of keyParts) {
      data = data?.[part];
      if (!data) break;
    }

    return {
      meaning: textKey.meaning,
      value: data,
    };
  });

 

  return (
    <div className="w-full">
      <div className="flex w-full flex-wrap">
        {/* Render each response key */}
        <ObjectDetectionDraw detections={PredictDrawData} InputImage={resultImage} aiDisplayType={ai_text_type || ''}/>
          
    
           <TextResultDisplay predictResult={predictResult} tags={["tag1", "tag2", "tag3"]} />
        
        {/* <pre>{JSON.stringify(textData, null, 2)}</pre> */}
        </div>
    </div>
  );
};

export default ObjectDetectionResultComponent;