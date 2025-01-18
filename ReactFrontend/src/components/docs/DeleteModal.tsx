import React from "react";

interface DeleteModalProps {
  isVisible: boolean;
  onDelete: () => void;
  onCancel: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isVisible,
  onDelete,
  onCancel,
}) => {
  if (!isVisible) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-6 w-1/3">
          <h2 className="text-center text-xl font-semibold mb-4">
            Are you sure you want to delete?
          </h2>
          <div className="flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 bg-black opacity-25" onClick={onCancel} />
    </>
  );
};

export default DeleteModal;
