import React from "react";
import { Link } from "react-router-dom";
import { formatDate, formatTime } from "../function/util";

interface HistoryUploadSectionProps {
  historyData: any[];
  workspaceId: string;
  projectId: string;
  inputType: string;  // เพิ่ม inputType เพื่อเช็คประเภท
}

const HistoryUploadSection: React.FC<HistoryUploadSectionProps> = ({
  historyData,
  workspaceId,
  projectId,
  inputType
}) => {
  return (
    <div>
      {historyData.map((entry, index) => (
        <Link
          to={`/workspaces/${workspaceId}/project/${projectId}/history/detail/${entry.historyId}`}
          key={index}
        >
          <div className="mb-6">
            {/* วันที่ */}
            <h1 className="text-2xl font-normal">{formatDate(entry.createdAt)}</h1>

            {/* เวลา */}
            <div className="flex items-center space-x-2 px-2 rounded-[5px]">
              <span className="text-lg font-normal">{formatTime(entry.createdAt)}</span>
              <div className="w-[80%] h-[0px] border border-zinc-300 mx-auto" />
            </div>

            {/* ข้อมูลผู้ใช้ */}
            <div className="flex items-center my-4 w-fit">
              <img className="w-10 h-10 rounded-full border-2" src={entry.user.picture} />
              <div className="ml-2">
                <span className="text-black text-lg font-normal">{entry.user.name}</span>
                <span className="text-black text-lg font-normal">
                  {inputType === "วิดีโอ" ? " 1 วิดีโอ" : " 1 รูปภาพ"}
                </span>
              </div>
            </div>

            {/* แสดงผลตามประเภท input_type */}
            <div className="flex flex-wrap">
              <div className="mb-8">
                {inputType === "วิดีโอ" ? (
                  <video
                    className="w-28 h-28 mr-6 border-2 object-cover"
                    src={entry.filePath}
                    controls  // เพิ่ม controls เพื่อให้กด Play ได้
                  />
                ) : (
                  <img
                    className="w-28 h-28 mr-6 border-2 object-cover"
                    src={entry.filePath}
                    alt={entry.user.name}
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default HistoryUploadSection;
