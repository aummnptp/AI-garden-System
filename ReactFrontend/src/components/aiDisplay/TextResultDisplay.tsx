import { PictureOutlined } from "@ant-design/icons";
import React from "react";

interface Prediction {
  [key: string]: any;
}



interface PredictResult {
  prediction: {
    detections?: Prediction[];
    [key: string]: any;
  };
  response_keys?: {
    key: string;
    meaning: string;
    displayFormat?: string;
  }[];
}

interface TextResultDisplayProps {
  predictResult: PredictResult;
  tags?: string[];
  aiName:string;
  ai_type:string;
  colorSet?: string[]; 
}

const TextResultDisplay: React.FC<TextResultDisplayProps> = ({
  predictResult,
  tags = [],
  aiName,ai_type,
  colorSet = [], 
}) => {
  const getMeaningForKey = (key: string) => {
    const keyWithMeaning = predictResult.response_keys?.find(
      (item) => item.key === key
    );
    return keyWithMeaning ? keyWithMeaning.meaning : key;
  };

  const detections = predictResult.prediction.detections || [];
  const isDetectionBased = detections.length > 0;

  const formatValue = (value: any) => { if (typeof value === "number") { return value.toFixed(2); } return value; };

  return (
    <div className="w-full">
      <div className="flex justify-start items-center p-0 space-x-4">
        <PictureOutlined style={{ fontSize: "32px", color: "#4f46e5" }} />
        <h1 className="text-3xl font-medium tracking-tight text-indigo-900 mb-0">
          Image Name
        </h1>
      </div>
      <div className="flex justify-start items-center p-0 space-x-4">
        <span className="text-gray-600 text-lg">{aiName}</span>
        <span className="text-gray-400">| {ai_type}</span>
        {/* <span className="text-gray-400 text-lg">{predictResult.ai_type}</span> */}
      </div>
      <div className="flex justify-start mb-2 mt-4 flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="w-fit bg-indigo-600 rounded-[5px] px-2.5 py-0.5 text-white text-lg font-normal"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto" />
      <div className="py-4">
        <h4 className="text-2xl">
          <i className="bi bi-clipboard-check-fill text-blue-600 mr-2"></i> ผลลัพธ์การทำนาย
        </h4>
        <table className="min-w-full mt-4 bg-white rounded-lg shadow">
        <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="py-3 px-4 text-left text-lg font-medium"></th>
              {isDetectionBased
                ? Object.keys(detections[0] || {})
                    .filter((key) => {
                      const fullKey = `detections.${key}`;
                      const keyItem = predictResult.response_keys?.find((item) => item.key === fullKey);
                      return keyItem?.displayFormat === "text";
                    })
                    .map((key) => (
                      <th key={key} className="py-3 px-4 text-left text-lg font-medium">
                        {getMeaningForKey(`detections.${key}`)}
                      </th>
                    ))
                : predictResult.response_keys
                    ?.filter((keyItem) => keyItem.displayFormat === "text")
                    .map((keyItem) => (
                      <th key={keyItem.key} className="py-3 px-4 text-left text-lg font-medium">
                        {keyItem.meaning}
                      </th>
                    ))}
              <th className="py-3 px-4 text-left text-lg font-medium">Color</th> 
            </tr>
          </thead>
          <tbody>
            {isDetectionBased ? (
              detections.length > 0 ? (
                detections.map((detection, index) => (
                  <tr key={index} className="bg-gray-100 border-b">
                    <td className="py-3 px-4 text-indigo-800 text-2xl font-medium">
                      {index + 1}
                    </td>
                    {Object.keys(detection)
                      .filter((key) => {
                        const fullKey = `detections.${key}`;
                        const keyItem = predictResult.response_keys?.find((item) => item.key === fullKey);
                        return keyItem?.displayFormat === "text";
                      })
                      .map((key) => (
                        <td key={key} className="py-3 px-4 text-gray-800 text-xl">
                          {Array.isArray(detection[key])
                            ? detection[key].map((coord: number[], coordIndex: number) => (
                                <div key={coordIndex}>{coord.join(", ")}</div>
                              ))
                            : formatValue(detection[key]) || "-"}
                        </td>
                      ))}
                    <td className="py-3 px-4 text-gray-800 text-xl">
                      <div
                        className="w-8 h-8 rounded-full border-2"
                        style={{
                          backgroundColor: colorSet[index % colorSet.length] || "#4f46e5",
                        }}
                      ></div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={
                      Object.keys(detections[0] || {}).filter((key) => {
                        const fullKey = `detections.${key}`;
                        const keyItem = predictResult.response_keys?.find((item) => item.key === fullKey);
                        return keyItem?.displayFormat === "text";
                      }).length + 2
                    }
                    className="text-center py-4"
                  >
                    ไม่มีข้อมูล
                  </td>
                </tr>
              )
            ) : (
              <tr className="bg-gray-100 border-b">
                <td className="py-3 px-4 text-indigo-800 text-2xl font-medium">1</td>
                {predictResult.response_keys
                  ?.filter((keyItem) => keyItem.displayFormat === "text")
                  .map((keyItem) => (
                    <td key={keyItem.key} className="py-3 px-4 text-gray-800 text-xl">
                      {predictResult.prediction[keyItem.key] !== undefined
                        ? formatValue(predictResult.prediction[keyItem.key])
                        : "-"}
                    </td>
                  ))}
                <td className="py-3 px-4 text-gray-800 text-xl">
                  <div
                    className="w-8 h-8 rounded-full border-2"
                    style={{
                      backgroundColor: colorSet[0] || "#4f46e5",
                    }}
                  ></div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TextResultDisplay;