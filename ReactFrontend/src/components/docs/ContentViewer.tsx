// ContentViewer Component
import React from "react";
import { Button } from "@mui/material";
import { EditOutlined } from "@ant-design/icons";

type ContentViewerProps = {
  currentPageData: string;
  onEdit: () => void;
};

const ContentViewer: React.FC<ContentViewerProps> = ({ currentPageData, onEdit }) => {
  return (
    
    <div className="w-full h-full flex flex-col justify-between bg-white pt-4">
    {/* Content */}
    <div className="prose custom-editor max-w-full w-[100%] px-4">
    <div dangerouslySetInnerHTML={{ __html: currentPageData }} />
    </div>
    {/* Edit Button Section */}
    <div className="pr-12  w-full h-[12%] bg-white border border-zinc-300 fixed bottom-0 right-0 flex justify-end items-center">
      <Button
        variant="contained"
        size="large"
        sx={{
          backgroundColor: "#4f46e5",
          "&:hover": {
            backgroundColor: "#3730a3",
          },
        }}
        onClick={onEdit}
      >
        <EditOutlined /> Edit Document Content
      </Button>
    </div>
  </div>
  );
};

export default ContentViewer;
