import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import React from 'react'

interface CreateProjectCardProps {
    id:number;
    name:string;
    aiDesc: string;
    img:string;
    type: string;
    tags:string[];
    isSelected: boolean; // เพิ่มตัวบ่งบอกว่าการ์ดถูกเลือกหรือไม่
    onSelect: () => void; // เพิ่มฟังก์ชันที่ใช้เมื่อการ์ดถูกคลิก
  }

  const CreateProjectCard: React.FC<CreateProjectCardProps> = (props) => {
    return (
      <div
        className={`mx-auto my-5 w-11/12 max-w-[300px] h-[300px] bg-white shadow border rounded-[15px] p-4 cursor-pointer 
          ${props.isSelected ? 'border-2 border-indigo-600 shadow-lg ring-2 ring-indigo-400' : 'border-1 border-gray-300 shadow-md'}
        `}
        onClick={props.onSelect} // เรียกฟังก์ชันเมื่อการ์ดถูกคลิก
      >
        {/* รูปภาพ */}
        <div className="w-full h-40">
          <img
            className="w-full h-full object-cover rounded-md"
            src={props.img}
            alt={props.name}
          />
        </div>
  
        {/* ชื่อ AI */}
        <h1 className="py-2 text-black text-[20px] font-semibold text-center truncate">
          {props.name}
        </h1>
  
        {/* ประเภท AI */}
        <div className="flex justify-center mb-2">
          <span className="w-fit bg-sky-500 rounded-[15px] px-2.5 py-0.5 text-white text-sm font-normal">
            {props.type}
          </span>
        </div>
  
        {/* คำอธิบาย AI (จำกัดความยาว 3 บรรทัด) */}
        <p className="px-2 py-1 text-sm text-gray-700 line-clamp-3 overflow-hidden">
          {props.aiDesc}
        </p>
  
        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-1 mt-2">
          {props.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-indigo-500 text-white text-xs font-normal rounded-[10px] px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  };
  


export default CreateProjectCard