import React from "react";

interface EditModalProps {
  isVisible: boolean;
  position: { top: number; left: number };
  onRename: () => void;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
  isVisible,
  position,
  onRename,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        style={{ top: position.top, left: position.left }}
        className="absolute bg-white shadow-lg rounded-lg p-4"
      >
        <ul>
          <li
            className="cursor-pointer p-2 hover:bg-gray-100"
            onClick={onRename}
          >
            Rename
          </li>
          <li
            className="cursor-pointer p-2 text-red-500 hover:bg-gray-100"
            onClick={onClose}
          >
            Close
          </li>
        </ul>
      </div>
      <div className="fixed inset-0 bg-black opacity-25" onClick={onClose} />
    </div>
  );
};

export default EditModal;
