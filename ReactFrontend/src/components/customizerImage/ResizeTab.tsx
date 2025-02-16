import React from "react";
import { Button, Checkbox, FormControlLabel } from "@mui/material";

interface ResizeTabProps {
  resizeWidth: number;
  resizeHeight: number;
  handleResizeWidthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleResizeHeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSymmetricResize: boolean;
  setIsSymmetricResize: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveResize: () => void;
}

const ResizeTab: React.FC<ResizeTabProps> = ({
  resizeWidth,
  resizeHeight,
  handleResizeWidthChange,
  handleResizeHeightChange,
  isSymmetricResize,
  setIsSymmetricResize,
  handleSaveResize,
}) => {
  return (
    <div className="w-full">
      <p className="my-4">ขนาดหลังResize:</p>
      <span className="text-xl bg-orange-100 text-amber-700 font-medium rounded-md w-fit px-4 my-4">
        width: {resizeWidth} (px)
      </span>
      <span className="mx-2">x</span>
      <span className="text-xl bg-orange-100 text-amber-700 font-medium rounded-md w-fit px-4 my-4">
        height: {resizeHeight} (px)
      </span>
      <div className="flex gap-2 py-4">
        <label className="w-[45%]">
          ความกว้าง (px)
          <input
            type="number"
            value={resizeWidth}
            onChange={handleResizeWidthChange}
            className="w-full p-2 border border-gray-300 rounded-lg no-spinner focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
        </label>
        <label className="w-[45%]">
          ความสูง (px)
          <input
            type="number"
            value={resizeHeight}
            onChange={handleResizeHeightChange}
            className="w-full p-2 border border-gray-300 rounded-lg no-spinner focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
        </label>
      </div>
      <div className="">
        <FormControlLabel
          control={
            <Checkbox
              checked={isSymmetricResize}
              onChange={(e) => setIsSymmetricResize(e.target.checked)}
              color="primary"
            />
          }
          label="Symmetric Resize"
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#4f46e5", "&:hover": { backgroundColor: "#3730a3" } }}
          onClick={handleSaveResize}
        >
          Apply Resize
        </Button>
      </div>
    </div>
  );
};

export default ResizeTab;
