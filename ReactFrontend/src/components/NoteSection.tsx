import React from "react";
import { formatDate, formatTime } from "../function/util";
import { SpeakerNotesOutlined } from "@mui/icons-material";

interface NoteSectionProps {
  projectNoteData: any[];
}

const NoteSection: React.FC<NoteSectionProps> = ({ projectNoteData }) => {
  return (
    <div className="w-full flex flex-col items-center">
    {projectNoteData.length > 0 ? (
      projectNoteData.map((note, index) => (
        <div key={index} className="px-4 border-2 rounded-lg w-[75%] my-4 bg-white shadow-md">
          {/* 🔹 Header ส่วนบน (ชื่อผู้ใช้ + เวลา) */}
          <div className="flex justify-between w-full items-center px-4 py-3 border-b border-gray-200">
            <div className="flex items-center">
              <img
                className="w-10 h-10 rounded-full border-2"
                src={note.user?.picture || "/images/homeImage/profile.webp"}
                alt="User Profile"
              />
              <div className="ml-2">
                <p className="text-black text-lg font-medium">{note.user?.name || "Unknown User"}</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">{new Date(note.created_at).toLocaleTimeString()}</p>
          </div>

          {/* 🔹 Note Content */}
          <div className="flex w-full px-4 py-3">
            {/* 🔹 ภาพประกอบ (ใช้รูปจาก History ถ้ามี) */}
            {note.history?.filePath ? (
              <div className="w-[20%]">
                <img
                  className="w-36 h-36 object-cover border-2 rounded-md"
                  src={note.history.filePath}
                  alt="Note Image"
                />
                <p className="text-sm text-gray-600">{note.history.image_name || "image_name"}</p>
              </div>
            ) : null}

            {/* 🔹 เนื้อหา Note */}
            <div className="p-4 w-[80%]">
              <p className="text-indigo-800 text-2xl font-medium flex items-center">
                <SpeakerNotesOutlined className="mr-2" />
                {note.title}
              </p>
              <p className="text-black text-lg font-normal">{note.content}</p>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-lg mt-4">ไม่มีบันทึก</p>
    )}
  </div>
    // <p className="text-sm text-gray-500">สร้างเมื่อ: {formatDate(note.created_at)}
            //  เวลา: {formatTime(note.created_at)}</p>
  );
};

export default NoteSection;