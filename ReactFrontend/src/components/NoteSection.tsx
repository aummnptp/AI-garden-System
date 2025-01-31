// NoteSection.tsx
import React from "react";
import { SpeakerNotesOutlined } from "@mui/icons-material";

interface NoteSectionProps {
  projectNoteData: any[];
}

const NoteSection: React.FC<NoteSectionProps> = ({ projectNoteData }) => {
  return (
    <div>
      {projectNoteData.map((note, index) => (
        <div key={index} className="px-4 border-2 rounded-lg w-[75%] my-4">
          <div className="flex justify-between w-full items-center">
            <div className="flex items-center my-4 w-fit">
              <img className="w-10 h-10 rounded-full border-2" src="/images/homeImage/profile.webp" />
              <div className="ml-2">
                <text className="text-black text-lg font-normal">John Doe</text>
              </div>
            </div>
            <text className="text-lg font-normal">13.00 น.</text>
          </div>
          <div className="flex w-full">
            <div className="w-[20%] mb-8">
              <img className="w-36 h-36 object-cover" src="/images/ai/dermatophyte.jpg" />
              <p>image_name</p>
            </div>
            <div className="p-4 w-[80%]">
              <p className="text-indigo-800 text-2xl font-medium">
                <SpeakerNotesOutlined /> หัวข้อ Note Example
              </p>
              <text className="text-black text-lg font-normal">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eget vehicula felis, sit amet
                porta eros.
              </text>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteSection;
