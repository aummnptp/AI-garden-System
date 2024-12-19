import { PictureOutlined } from '@ant-design/icons';
import React from 'react'


interface Prediction{
 label: string;
 confidence: number;
}

interface PredictResult{
    ai_type:string;
    prediction:{ detections: Prediction[]};
    response_keys?: { key: string;meaning: string}[];
}
interface TextResultDisplayProps{
    predictResult: PredictResult;
}

const TextResultDisplay: React.FC<TextResultDisplayProps> = ({ predictResult }) => {  
    
    
    const getMeaningForKey = (key:string) =>{
        const keyWithMeaning = predictResult.response_keys?.find((item)=>item.key === key);
        return keyWithMeaning ? keyWithMeaning.meaning : key;
    };
    return (

    <div className="w-[100%] border rounded-[5px] p-10">
      <div className="flex justify-start items-center p-0 space-x-4">
        <PictureOutlined style={{ fontSize: "32px", color: "#4f46e5" }} />
        <h1 className="text-3xl font-medium tracking-tight text-indigo-900 mb-0">
          Image Name
        </h1>
      </div>
      <div className="flex justify-start items-center p-0 space-x-4">
        <span className="text-gray-600 text-lg">AI Name</span>
        <span className="text-gray-400">|</span>
        <span className="text-gray-400 text-lg">{predictResult.ai_type}</span>
      </div>
      <div className="flex justify-start mb-2 mt-4">
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
      <div className="py-4">
        <h4 className="text-2xl">
          <i className="bi bi-clipboard-check-fill text-blue-600 mr-2"></i> ผลลัพธ์การทำนาย
        </h4>
        <table className="min-w-full mt-4 bg-white rounded-lg shadow">
          <tbody>
            {predictResult.prediction.detections.length > 0 ? (
              predictResult.prediction.detections.map((detection, index) => (
                <tr key={index} className="bg-gray-100 border-b">
                  <th className="py-3 px-4 text-indigo-800 text-2xl font-medium">
                    {getMeaningForKey("predictions") + " " + (index + 1)}
                  </th>
                  <td className="py-3 px-4 text-gray-800 text-xl">
                    <span className="py-3 px-4 text-indigo-600 text-xl font-medium">Label:</span>
                    {` ${detection.label}`}
                  </td>
                  <td className="py-3 px-4 text-gray-800 text-xl">
                    <span className="py-3 px-4 text-indigo-600 text-xl font-medium">Confidence:</span>
                    {` ${detection.confidence.toFixed(2)}`}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center py-4">ไม่มีข้อมูล</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

  )
}

export default TextResultDisplay
