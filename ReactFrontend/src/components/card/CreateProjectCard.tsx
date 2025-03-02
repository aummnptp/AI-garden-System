import React from "react";

interface CreateProjectCardProps {
  id: string;
  name: string;
  aiDesc: string;
  img: string;
  type: string;
  tags: string[];
  isSelected: boolean;
  onSelect: () => void;
}

const CreateProjectCard: React.FC<CreateProjectCardProps> = (props) => {
  const { isSelected } = props;

  return (
    <div
      onClick={props.onSelect}
      className={`
        relative mx-auto my-5 w-11/12 max-w-[300px] bg-white border rounded-[15px] p-4 cursor-pointer 
        transition-all duration-300 
        ${
          isSelected
            ?
              "border-2 border-indigo-600 shadow-lg ring-2 ring-indigo-400 scale-105"
            :
              "border-gray-300 shadow-md hover:shadow-xl hover:scale-105 hover:border-indigo-300"
        }
      `}
    >
      {/* รูปภาพ */}
      <div className="w-full h-40 overflow-hidden rounded-md">
        <img
          className="w-full h-full object-cover"
          src={props.img}
          alt={props.name}
        />
      </div>

      {/* ชื่อ AI */}
      <h1 className="py-2 text-black text-lg font-semibold text-center truncate">
        {props.name}
      </h1>

      {/* ประเภท AI */}
      <div className="flex justify-center mb-2">
        <span className="bg-sky-500 rounded-full px-3 py-1 text-white text-sm font-medium">
          {props.type}
        </span>
      </div>

      {/* คำอธิบาย AI (จำกัดความยาว 3 บรรทัด) */}
      <p className="px-2 text-sm text-gray-700 line-clamp-3 overflow-hidden">
        {props.aiDesc}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap justify-center gap-2 mt-2 px-2">
        {props.tags.map((tag, index) => (
          <span
            key={index}
            className="bg-indigo-500 text-white text-xs font-normal rounded-full px-2 py-0.5"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CreateProjectCard;
