import React from "react";
import { Button } from "@mui/material";
import { Contrast } from "@mui/icons-material";

interface GrayscaleTabProps {
  isGrayscale: boolean;
  toggleGrayscale: () => void;
  handleSaveGrayscale: () => void;
}

const GrayscaleTab: React.FC<GrayscaleTabProps> = ({
  isGrayscale,
  toggleGrayscale,
  handleSaveGrayscale,
}) => {
  return (
    <div className="w-full">
      <button
        className={`flex items-center justify-center my-4 px-2 w-fit max-w-[40%] h-12 rounded-lg border ${
          isGrayscale ? "border-blue-700 text-blue-700" : "border-gray-300"
        } hover:bg-gray-100 cursor-pointer hover:text-blue-700`}
        onClick={toggleGrayscale}
      >
        <Contrast /> {isGrayscale ? "ลบ Grayscale" : "ปรับ Grayscale"}
      </button>
      <Button
        variant="contained"
        sx={{ backgroundColor: "#4f46e5", "&:hover": { backgroundColor: "#3730a3" } }}
        onClick={handleSaveGrayscale}
      >
        Apply Grayscale
      </Button>
    </div>
  );
};

export default GrayscaleTab;
