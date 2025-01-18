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
    <div>
      <div className="pr-12 w-full h-[12%] bg-white border border-zinc-300 fixed bottom-0 right-0 flex justify-end items-center">
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
      <div className="pt-5 pl-8" dangerouslySetInnerHTML={{ __html: currentPageData }} />
    </div>
  );
};

export default ContentViewer;
