import React from "react";
import ImageDetectionResultDraw from "./ImageDetectionResultDraw";

import TextResultDisplay from "./TextResultDisplay";
import RegressionChart from "./RegressionResultDraw";

interface PredictResult {
  ai_type: string;
  prediction: { [key: string]: any };
  response_keys?: { key: string; meaning: string; displayFormat: string }[];
  ai_model?: {
    colorSet: string[];
    ai_tag: string;
    name: string;
    ai_type: string;
  };
}

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
  polygons: [number, number][][]; // ต้องเป็นอาร์เรย์ของอาร์เรย์จุด
}
interface AIDisPlayResultComponentProps {
  predictResult: PredictResult;
  resultImage: string;
}

  const AIDisPlayResultComponent: React.FC<AIDisPlayResultComponentProps> = ({
    predictResult,
    resultImage,
  }) => {
  
    let PredictDrawData: ObjectDetection[] | SegmentationDetection[] | null = null;
    let ai_text_type = null;
    
    // ถ้าตีย์มี displayFormat data ให้ PredictDrawData = display format data ตัวนั้น
    const searchDrawKey = predictResult.response_keys?.find(
      (responseKey) =>
        responseKey.displayFormat === "objectdetection" || 
        responseKey.displayFormat === "segmentation" || 
        responseKey.displayFormat === "chart"
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
      PredictDrawData = data as ObjectDetection[] | SegmentationDetection[];
    }
    
  
  
    const textKeys = predictResult.response_keys?.filter(
      (responseKey) => responseKey.displayFormat === "text"
    );
    console.log(textKeys)
  
    // สร้างข้อมูลที่เหมาะสมสำหรับ TextResultDisplay
    // const textData = textKeys?.map((textKey) => {
    //   const keyParts = textKey.key.split(".");
    //   let data = predictResult.prediction;
  
    //   // เดินทางไปตาม key เพื่อดึงค่าจาก prediction
    //   for (const part of keyParts) {
    //     data = data?.[part];
    //     if (!data) break;
    //   }
  
    //   return {
    //     meaning: textKey.meaning,
    //     value: data,
    //   };
    // });
  
   

 

  return (
    <div className="w-full">
      {searchDrawKey && (searchDrawKey.displayFormat === "chart") ? (
      <div className="flex w-full flex-wrap">
        {/* Render each response key */}
        <RegressionChart detections={PredictDrawData} />
        <TextResultDisplay predictResult={predictResult} tags={[predictResult.ai_model?.ai_tag || '']}
        aiName={predictResult.ai_model?.name|| ''}ai_type={predictResult.ai_model?.ai_type|| ''} 
        colorSet={predictResult.ai_model?.colorSet|| []}  />
                </div>
      ) : (
        <div className="flex w-full flex-wrap">
        <ImageDetectionResultDraw detections={PredictDrawData} InputImage={resultImage} 
        aiDisplayType={ai_text_type || ''} colorSet={predictResult.ai_model?.colorSet||[]}/>

        <TextResultDisplay predictResult={predictResult} tags={[predictResult.ai_model?.ai_tag || '']}
        aiName={predictResult.ai_model?.name|| ''}ai_type={predictResult.ai_model?.ai_type|| ''} 
        colorSet={predictResult.ai_model?.colorSet|| []} 
        />
 
        </div>
      )}
    </div>
  );
};

export default AIDisPlayResultComponent;