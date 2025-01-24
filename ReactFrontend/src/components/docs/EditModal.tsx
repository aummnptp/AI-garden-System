import React from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

type EditModalProps = {
  show: boolean;
  position: { top: number; left: number };
  onRename: () => void;
  onDelete: () => void;
  onClose: (event: React.MouseEvent) => void;
};

const EditModal: React.FC<EditModalProps> = ({ show, position, onRename, onDelete, onClose }) => {
  if (!show) return null;

  return (
    <div className="flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <div
        style={{
          top: position.top,
          left: position.left,
        }}
        className="z-50 border-0 rounded-lg relative flex flex-col w-fit h-fit py-2 bg-white"
      >
        <ul>
          <li
            className="cursor-pointer rounded-lg hover:bg-gray-100 group focus:ring-4 focus:bg-blue-300 px-4 py-2"
            onClick={onRename}
          >
            <EditOutlined />
            rename
          </li>
          <li
            onClick={onDelete}
            className="cursor-pointer rounded-lg hover:bg-gray-100 group focus:ring-4 focus:bg-blue-300 px-4 py-2"
          >
            <span className="text-[#f93a37]">
              <DeleteOutlined />
              delete
            </span>
          </li>
        </ul>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black" onClick={onClose}></div>
    </div>
  );
};

export default EditModal;
