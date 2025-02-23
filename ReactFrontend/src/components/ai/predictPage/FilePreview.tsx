export const FilePreview: React.FC<{
    file: File;
    type: "image" | "video";
    onRemove: () => void;
  }> = ({ file, type, onRemove }) => {
    const fileURL = URL.createObjectURL(file);
    return (
      <div className="relative text-center flex flex-col items-center justify-center py-8">
        <div
          onClick={onRemove}
          className="absolute top-4 right-4 bg-gray-800 text-white rounded-full h-8 w-8 flex items-center justify-center p-1 hover:bg-red-500 cursor-pointer"
        >
          <i className="bi bi-x-lg"></i>
        </div>
        {type === "image" ? (
          <img
            src={fileURL}
            alt="Uploaded"
            style={{ maxWidth: "450px", maxHeight: "450px", minWidth: "150px", minHeight: "150px" }}
            className="object-cover w-full h-full"
          />
        ) : (
          <video
            controls
            src={fileURL}
            style={{ maxWidth: "450px", maxHeight: "450px", minWidth: "150px", minHeight: "150px" }}
            className="object-cover w-full h-full"
          />
        )}
      </div>
    );
  };