import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatDate, formatTime, getImageUrl } from "../function/util";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import ConfirmDeleteModal from "./history/modal/ConfirmDeleteModal";
import { useDeleteHistoryMutation } from "../hook/history/useDeleteHistoryMutation";

interface HistoryUploadSectionProps {
  historyData: any[];
  workspaceId: string;
  projectId: string;
  inputType: string; // เพิ่ม inputType เพื่อเช็คประเภท
}

const HistoryUploadSection: React.FC<HistoryUploadSectionProps> = ({
  historyData,
  workspaceId,
  projectId,
  inputType,
}) => {
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const { mutate: deleteHistory } = useDeleteHistoryMutation();

  const handleDeleteClick = (historyId: string) => {
    setSelectedHistoryId(historyId);
    setOpenConfirmModal(true);
  };

  const confirmDelete = () => {
    if (selectedHistoryId) {
      deleteHistory({ workspaceId, projectId, historyId: selectedHistoryId });
      setOpenConfirmModal(false);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
    {historyData.map((entry) => (
      <div
        key={entry.historyId}
        className="p-4 border-b border-gray-300 rounded-lg"
      >
        {/* วันที่และเวลา */}
        <h1 className="text-xl font-semibold text-gray-800">{formatDate(entry.createdAt)}</h1>
        <p className="text-sm text-gray-600">{formatTime(entry.createdAt)}</p>

        {/* ข้อมูลผู้ใช้ + ปุ่มลบ */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            <img
              className="w-10 h-10 rounded-full border-2"
              src={getImageUrl(entry.user.picture)}
              alt={entry.user.name}
            />
            <div className="ml-3 flex items-center gap-2">
              <span className="text-gray-900 font-medium">{entry.user.name}</span>
              <span className="text-gray-600">
                {inputType === "วิดีโอ" ? "1 วิดีโอ" : "1 รูปภาพ"}
              </span>
              {/* ปุ่มลบถูกย้ายมาที่นี่ */}
              <IconButton
                onClick={() => handleDeleteClick(entry.historyId)}
                color="error"
                className="ml-2"
                
              >
                <Delete />
              </IconButton>
            </div>
          </div>
        </div>

        {/* แสดงผลไฟล์ที่อัปโหลด */}
        <Link
          to={`/workspaces/${workspaceId}/project/${projectId}/history/detail/${entry.historyId}`}
          className="block mt-4 p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          {inputType === "วิดีโอ" ? (
            <video
              className="w-32 h-32 border-2 rounded-md object-cover"
              src={getImageUrl(entry.filePath)}
              controls
            />
          ) : (
            <img
              className="w-32 h-32 border-2 rounded-md object-cover"
              src={getImageUrl(entry.filePath)}
              alt={entry.user.name}
              loading="lazy"
            />
          )}
        </Link>
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
