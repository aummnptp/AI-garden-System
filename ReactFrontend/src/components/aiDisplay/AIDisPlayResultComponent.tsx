import React from "react";
import ImageDetectionResultDraw from "./ImageDetectionResultDraw";
import TextResultDisplay from "./TextResultDisplay";
import RegressionChart from "./RegressionResultDraw";
import { PredictResult } from "../../types/Ai";



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

interface AIDisPlayResultComponentProps {
  predictResult: PredictResult | undefined;
  resultImage: string;
}
const AIDisPlayResultComponent: React.FC<AIDisPlayResultComponentProps> = ({
  predictResult,
  resultImage,
}) => {
  let PredictDrawData: ObjectDetection[] | SegmentationDetection[] | null = null;
  let ai_text_type: string | null = null;

  const searchDrawKey = predictResult?.response_keys?.find(
    (responseKey) =>
      responseKey.displayFormat === "objectdetection" ||
      responseKey.displayFormat === "segmentation" ||
      responseKey.displayFormat === "chart"
  );

  if (searchDrawKey) {
    ai_text_type = searchDrawKey.displayFormat || null;
    const keyParts = searchDrawKey.key.split(".");
    let data = predictResult?.prediction;
    for (const part of keyParts) {
      data = data?.[part];
      if (!data) break;
    }
 
      PredictDrawData = data as ObjectDetection[] | SegmentationDetection[];
    
  }

  return (
    <div className="w-full">
      {searchDrawKey && searchDrawKey.displayFormat === "chart" ? (
        <div className="flex w-full flex-wrap">
          <RegressionChart detections={PredictDrawData} />
          {predictResult && (
          <TextResultDisplay
            predictResult={predictResult}
            tags={[predictResult.ai_model?.ai_tag || ""]}
            aiName={predictResult.ai_model?.name || ""}
            ai_type={predictResult.ai_model?.ai_type || ""}
            colorSet={predictResult.ai_model?.colorSet || []}
          />
)}
        </div>
      ) : (
        <div className="flex w-full flex-wrap">
     <div className="w-[60%] text-center space-y-2 border rounded-[5px] p-10 justify-center">
          <ImageDetectionResultDraw
            detections={PredictDrawData}
            InputImage={resultImage}
            aiDisplayType={ai_text_type || ""}
            colorSet={predictResult?.ai_model?.colorSet || []}
          />
     </div>
     <div className="w-[40%] border rounded-[5px] p-10">

          {predictResult && (
          <TextResultDisplay
            predictResult={predictResult}
            tags={[predictResult.ai_model?.ai_tag || ""]}
            aiName={predictResult.ai_model?.name || ""}
            ai_type={predictResult.ai_model?.ai_type || ""}
            colorSet={predictResult.ai_model?.colorSet || []}
          />
            )}
            </div>
        </div>
      )}
    </div>
  );
};

export default AIDisPlayResultComponent;
