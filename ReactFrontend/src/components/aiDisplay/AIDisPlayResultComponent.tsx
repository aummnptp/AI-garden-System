import React from "react";
import ImageDetectionResultDraw from "./ImageDetectionResultDraw";
import TextResultDisplay from "./TextResultDisplay";
import RegressionChart from "./RegressionResultDraw";
import { convertDetectionsToPolygons } from "../../function/utils/polygon.util";
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
    if (searchDrawKey.displayFormat === "segmentation") {
      if (Array.isArray(data)) {
        PredictDrawData = convertDetectionsToPolygons(data) as SegmentationDetection[];
      }
    } else {
      PredictDrawData = data as ObjectDetection[] | SegmentationDetection[];
    }
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
    
          <ImageDetectionResultDraw
            detections={PredictDrawData}
            InputImage={resultImage}
            aiDisplayType={ai_text_type || ""}
            colorSet={predictResult?.ai_model?.colorSet || []}
          />
     
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
      )}
    </div>
  );
};

export default AIDisPlayResultComponent;
