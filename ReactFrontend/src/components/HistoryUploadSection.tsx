// HistoryUploadSection.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatDate, formatTime } from "../function/util";
import { useHistoryData } from "../hook/history/useHistoryData";
import { deleteHistoryService } from "../api/services/HistoryService";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import ConfirmDeleteModal from "./history/modal/ConfirmDeleteModal";

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
  const { refetchHistory } = useHistoryData(); // ใช้ refetch เพื่อโหลดข้อมูลใหม่
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);


  const handleDeleteClick = (historyId: string) => {
    setSelectedHistoryId(historyId);
    setOpenConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (selectedHistoryId) {
      try {
        await deleteHistoryService(workspaceId, projectId, selectedHistoryId);
        refetchHistory(); // โหลดข้อมูลใหม่หลังลบสำเร็จ
      } catch (error) {
        console.error("Failed to delete history:", error);
      } finally {
        setOpenConfirmModal(false);
      }
    }
  };
  return (
    <div>
    {historyData.map((entry, index) => (
      <div key={index} className="relative flex justify-between items-center p-4 border-b border-gray-300">
        <Link to={`/workspaces/${workspaceId}/project/${projectId}/history/detail/${entry.historyId}`} className="w-full">
          {/* วันที่และเวลา */}
          <h1 className="text-2xl font-normal">{formatDate(entry.createdAt)}</h1>
          <div className="flex items-center space-x-2 px-2 rounded-[5px]">
            <span className="text-lg font-normal">{formatTime(entry.createdAt)}</span>
            <div className="w-[80%] h-[0px] border border-zinc-300 mx-auto" />
          </div>

          {/* ข้อมูลผู้ใช้ */}
          <div className="flex items-center my-4 w-fit">
            <img className="w-10 h-10 rounded-full border-2" src={entry.user.picture} />
            <div className="ml-2">
              <span className="text-black text-lg font-normal">{entry.user.name}</span>
              <span className="text-black text-lg font-normal"> 1 รูปภาพ</span>
            </div>
          </div>

          {/* รูปภาพ */}
          <div className="flex flex-wrap">
            <div className="mb-8">
              <img className="w-28 h-28 mr-6 border-2 object-cover" src={entry.filePath} />
            </div>
          </div>
        </Link>

        {/* ปุ่มลบ */}
        <IconButton
          className="absolute right-4 top-4"
          onClick={() => handleDeleteClick(entry.historyId)}
          color="error"
        >
          <Delete />
        </IconButton>
      </div>
    ))}

    {/* Modal ยืนยันการลบ */}
    <ConfirmDeleteModal
      open={openConfirmModal}
      onClose={() => setOpenConfirmModal(false)}
      onConfirm={confirmDelete}
    />
  </div>
);
};

export default HistoryUploadSection;