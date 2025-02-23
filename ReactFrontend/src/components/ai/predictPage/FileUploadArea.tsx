import { ChangeEvent, DragEvent } from "react";
import { FilePreview } from "./FilePreview";

export const FileUploadArea: React.FC<{
    file: File | null;
    setFile: (file: File | null) => void;
    accept: string;
    placeholder: string;
  }> = ({ file, setFile, accept, placeholder }) => {
    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
    };
  
    const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
    };
  
    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) setFile(selectedFile);
    };
  
    return file ? (
      <FilePreview
        file={file}
        type={accept.includes("image") ? "image" : "video"}
        onRemove={() => setFile(null)}
      />
    ) : (
      <label
        htmlFor="file-upload"
        className="mx-auto flex flex-col items-center justify-center w-[90%] p-6 border-2 border-dashed border-blue-500 rounded-lg h-96 bg-gray-50 cursor-pointer mt-10"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center justify-center text-center w-full h-full">
          <i className="bi bi-folder-fill text-blue-500 text-4xl mb-4"></i>
          <p className="text-gray-500">{placeholder}</p>
          <p className="text-gray-500">กดเพื่อเลือก หรือ ลากไฟล์มาวางที่นี่</p>
        </div>
        <input id="file-upload" type="file" accept={accept} onChange={handleFileSelect} className="hidden" />
      </label>
    );
  };
  