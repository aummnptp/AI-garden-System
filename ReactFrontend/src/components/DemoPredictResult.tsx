import { PictureOutlined } from "@ant-design/icons";
import React from "react";

interface Prediction {
  class_name: string;
  confidence: number;
}

interface PredictResult {
  ai_type: string;
  prediction: Prediction;
  regression_params: any | null;
}
interface DemoPredictResultProps {
  predictResult: PredictResult | null; // รับผลลัพธ์หรือ null
  resultImage: string;
}
const DemoPredictResult: React.FC<DemoPredictResultProps> = ({
  predictResult,
  resultImage,
}) => {
  if (!predictResult) {
    return <p>No prediction result yet.</p>;
  }

  return (
    <div className="w-full">
      <div className="flex w-full ">
        <div className=" w-[50%] text-center space-y-2  border rounded-[5px] p-10  flex justify-center ">
          <img
            src={resultImage}
            style={{
              maxWidth: "450px",
              maxHeight: "450px",
              minWidth: "150px",
              minHeight: "150px",
            }}
            alt="Crop me"
          />
        </div>
        <div className="w-[50%] border rounded-[5px]  p-10 ">
          <div className="flex justify-start items-center p-0 space-x-4">
            <PictureOutlined style={{ fontSize: "32px", color: "#4f46e5" }} />
            <h1 className="text-3xl font-medium tracking-tight text-indigo-900 mb-0">
              fileName
            </h1>
          </div>
          <div className="flex justify-start items-center p-0 space-x-4">
            <span className="text-gray-600 text-lg"> AI Name</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-400 text-lg">
              {predictResult.ai_type}
            </span>
          </div>
          <div className="flex justify-start mb-2 mt-4 ">
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
          <div className="border">
            <h4>ผลลัพธ์การทำนาย:</h4>
            <div>
              <span className="text-2xl">ชื่อClass: </span>
              <span className="text-xl">{predictResult.prediction.class_name}</span>
            </div>
            <div >
            <span className="text-2xl">
              Confidence:
            </span>
            <span className="text-xl">
            {" "}{predictResult.prediction.confidence.toFixed(2)}%
            </span>
            </div>

            {predictResult.regression_params ? (
              <p>
                Regression Params:{" "}
                {JSON.stringify(predictResult.regression_params)}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPredictResult;
