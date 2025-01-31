// HistoryUploadSection.tsx
import React from "react";
import { Link } from "react-router-dom";
import { formatDate, formatTime } from "../function/util";

interface HistoryUploadSectionProps {
  historyData: any[];
  workspaceId: string;
  projectId: string;
}

const HistoryUploadSection: React.FC<HistoryUploadSectionProps> = ({
  historyData,
  workspaceId,
  projectId,
}) => {
  return (
    <div>
      {historyData.map((entry, index) => (
        <Link
          to={`/workspaces/${workspaceId}/project/${projectId}/history/detail/${entry.historyId}`}
          key={index}
        >
          <div>
            {/* วันที่ */}
            <h1 className="text-2xl font-normal">{formatDate(entry.createdAt)}</h1>

            {/* เวลา */}
            <div className="flex items-center space-x-2 px-2 rounded-[5px]">
              <text className="text-lg font-normal">{formatTime(entry.createdAt)}</text>
              <div className="w-[80%] h-[0px] border border-zinc-300 mx-auto" />
            </div>

            {/* ข้อมูลผู้ใช้ */}
            <div className="flex items-center my-4 w-fit">
              <img className="w-10 h-10 rounded-full border-2" src={entry.user.picture} />
              <div className="ml-2">
                <text className="text-black text-lg font-normal">{entry.user.name}</text>
                <text className="text-black text-lg font-normal"> 1 รูปภาพ</text>
              </div>
            </div>

            {/* รูปภาพ */}
            <div className="flex flex-wrap">
              <div className="mb-8">
                <img className="w-28 h-28 mr-6 border-2 object-cover" src={entry.filePath} />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default HistoryUploadSection;
