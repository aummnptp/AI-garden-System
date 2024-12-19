import { PictureOutlined } from "@ant-design/icons";
import React from "react";

interface ResponseKey {
  key: string;
  meaning: string;
}
interface PredictResult {
  ai_type: string;
  prediction: any;
  regression_params?: any | null;
  response_keys?: ResponseKey[]; 
}
interface DemoPredictResultProps {
  predictResult: PredictResult;
  resultImage: string;
  aiDataProp: aiDataProp;
}
interface aiDataProp {
  id:number;
  name:string;
  description: string;
  img:string;
  input_desc:string;
  ai_type: string;
  ai_tag:string[];
}
const DemoPredictResult: React.FC<DemoPredictResultProps> = ({
predictResult, resultImage ,aiDataProp, 
}) => {
  const resultEntries = Object.entries(predictResult.prediction);
  const getMeaningForKey = (key: string) => {
   
    console.log("Key being processed:", key);
    
    const keyWithMeaning = predictResult.response_keys?.find(
      (item: { key: string; meaning: string }) => item.key === key
    );
    console.log("Matched key with meaning:", keyWithMeaning);
    return keyWithMeaning ? keyWithMeaning.meaning : key; // Use key itself if no meaning is found
  };
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
              Image
            </h1>
          </div>
          <div className="flex justify-start items-center p-0 space-x-4">
            <span className="text-gray-600 text-lg">    {aiDataProp.name}</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-400 text-lg">
            {aiDataProp.ai_type}
            </span>
          </div>
          <div className="flex justify-start mb-2 mt-4 ">
          {aiDataProp.ai_tag.map((tag: string, index: number) => (
            <span className="w-fit bg-indigo-600 rounded-[5px] me-2 px-2.5 py-0.5 text-white text-lg font-normal">
              {tag}
            </span>
            ))}
            {/* <span className="w-fit bg-indigo-600 rounded-[5px] me-2 px-2.5 py-0.5 text-white text-lg font-normal">
              tag2
            </span>
            <span className="w-fit bg-indigo-600 rounded-[5px] me-2 px-2.5 py-0.5 text-white text-lg font-normal">
              tag3
            </span> */}
          </div>
          <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto" />
          <div className="py-4">
            <div>
            <h4 className="text-2xl "> <i className="bi bi-clipboard-check-fill text-blue-600 mr-2"></i> ผลลัพธ์การทำนาย</h4>
        <table className="min-w-full mt-4 bg-white rounded-lg shadow">
                {resultEntries.length > 0 ? (
                  <tbody>
                    {/* Loop through resultEntries */}
                    {resultEntries.map(([key, value], index) => {
                      const displayText = getMeaningForKey(key); // Get the display text (meaning or key)
                      return (
                        <tr key={index} className="bg-gray-100 border-b">
                          <td className="py-3 px-4 text-indigo-800 text-xl font-medium">{displayText}</td>
                          <td className="py-3 px-4 text-gray-800 text-xl">
                            {typeof value === 'number' ? value.toFixed(2) : value?.toString() || 'ไม่มีข้อมูล'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan={2} className="text-center py-4">
                        ไม่มีข้อมูล
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
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
