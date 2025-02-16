import React from "react";
import ImageDetectionResultDraw from "./ImageDetectionResultDraw";
import TextResultDisplay from "./TextResultDisplay";


interface PredictResult {
  ai_type: string;
  prediction: { [key: string]: any };
  response_keys?: { key: string; meaning: string; displayFormat: string }[];
}

interface AIDisPlayResultComponentProps {
  predictResult: PredictResult;
  resultImage: string;
}


const AIDisPlayResultComponent: React.FC<AIDisPlayResultComponentProps> = ({
  predictResult,
  resultImage,
}) => {

  let PredictDrawData = null;
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
      {searchDrawKey && (searchDrawKey.displayFormat === "chart") ? (
      <div className="flex w-full flex-wrap">
        {/* Render each response key */}
        <ImageDetectionResultDraw detections={PredictDrawData} InputImage={resultImage} 
        aiDisplayType={ai_text_type || ''} colorSet={predictResult.ai_model.colorSet}/>
        
        <TextResultDisplay predictResult={predictResult} tags={[predictResult.ai_model.ai_tag]}
        aiName={predictResult.ai_model.name}ai_type={predictResult.ai_model.ai_type} 
        colorSet={predictResult.ai_model.colorSet} 
        />
        
        {/* <pre>{JSON.stringify(textData, null, 2)}</pre> */}
        </div>
      ) : (
        <div className="flex w-full flex-wrap">
        {/* Render each response key */}
        <ImageDetectionResultDraw detections={PredictDrawData} InputImage={resultImage} aiDisplayType={ai_text_type || ''}/>
        <TextResultDisplay predictResult={predictResult} tags={["tag1", "tag2", "tag3"]} />
        
        {/* <pre>{JSON.stringify(textData, null, 2)}</pre> */}
        </div>
      )}
    </div>
  );
};

export default AIDisPlayResultComponent;