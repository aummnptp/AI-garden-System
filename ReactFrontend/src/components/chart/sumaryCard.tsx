import React from 'react';
import { IconType } from 'react-icons';

interface SummaryCardProps {
  icon: React.ReactElement<IconType>;
  label: string;
  value: string;
  inputType: string;
  disable: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ icon, label, value, inputType, disable }) => {
  const cardClass = disable ? "flex items-center bg-white shadow rounded-md p-4 m-2" : "flex items-center bg-gray-300 shadow rounded-md p-4 m-2 opacity-50 cursor-not-allowed";

  return (
    <div className={cardClass}>
      <div className="w-12 h-12 bg-indigo-900 rounded flex items-center justify-center">
        {icon}
      </div>
      <div className="ml-4">
        <span className="text-indigo-900 text-2xl font-bold">{value}</span> <span className="text-indigo-900 text-2xl font-bold">{inputType}</span>
        <p className="text-gray-600">{label}</p>
      </div>
    </div>
  );
};

export default SummaryCard;