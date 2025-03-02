import React from "react";

import TextResultDisplay from "./TextResultDisplay";
import RegressionChart from "./RegressionResultDraw";

interface PredictResult {
  ai_type: string;
  prediction: { [key: string]: any };
  response_keys?: { key: string; meaning: string; displayFormat: string }[];
}

interface ChartResultDisplayProps {
  predictResult: PredictResult;
}

const ChartResultDisplay: React.FC<ChartResultDisplayProps> = ({
  predictResult,
}) => {

  let PredictData: number[] = [];
  
  const searchChartKey = predictResult.response_keys?.find(
    (responseKey) =>
      responseKey.displayFormat === "chart"
  );
  
  if (searchChartKey) {
  
    const keyParts = searchChartKey.key.split(".");
    let data = predictResult.prediction;
  
    for (const part of keyParts) {
      data = data?.[part];
      if (!data) break;
    }
  
    if (Array.isArray(data) && data.every(item => typeof item === 'number')) {
      PredictData = data;
    } else {
    }
  }

  return (
    <div className="w-full">
      <div className="flex w-full flex-wrap">
        {/* Render each response key */}
        <RegressionChart detections={PredictData || []}/>
           <TextResultDisplay predictResult={predictResult} tags={["tag1", "tag2", "tag3"]} aiName="AI Name" ai_type={predictResult.ai_type} />
        </div>
    </div>
  );
};

export default ChartResultDisplay;