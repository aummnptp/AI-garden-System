import React from "react";
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";

interface PaddingTabProps {
  paddingMode: string;
  setPaddingMode: React.Dispatch<React.SetStateAction<string>>;
  paddingSymmetric: number;
  handlePaddingSymmetricChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  handlePaddingTopChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePaddingBottomChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePaddingLeftChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePaddingRightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSavePadding: () => void;
  imagePaddedWidth: number;
  imagePaddedHeight: number;
}

const PaddingTab: React.FC<PaddingTabProps> = ({
  paddingMode,
  setPaddingMode,
  paddingSymmetric,
  handlePaddingSymmetricChange,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  handlePaddingTopChange,
  handlePaddingBottomChange,
  handlePaddingLeftChange,
  handlePaddingRightChange,
  handleSavePadding,
  imagePaddedWidth,
  imagePaddedHeight,
}) => {
  return (
    <div className="w-full">
      <div className="pb-4">
        <p className="my-4">ขนาดหลังPadding:</p>
        <span className="text-xl bg-orange-100 text-amber-700 font-medium rounded-md w-fit px-4 my-4">
          width: {imagePaddedWidth} (px)
        </span>{" "}
        <span className="mx-2">x</span>
        <span className="text-xl bg-orange-100 text-amber-700 font-medium rounded-md w-fit px-4 my-4">
          height: {imagePaddedHeight} (px)
        </span>
      </div>
      <FormControl>
        <FormLabel id="padding-mode-label">Padding Mode</FormLabel>
        <RadioGroup
          row
          aria-labelledby="padding-mode-label"
          name="padding-mode"
          value={paddingMode}
          onChange={(e) => setPaddingMode(e.target.value)}
        >
          <FormControlLabel value="custom" control={<Radio />} label="Custom" />
          <FormControlLabel value="square" control={<Radio />} label="Square" />
          <FormControlLabel value="symmetric" control={<Radio />} label="Symmetric" />
        </RadioGroup>
      </FormControl>
      {paddingMode === "symmetric" && (
        <div className="flex gap-2 py-4">
          <label className="w-[45%]">
            ขนาด (px)
            <input
              type="number"
              value={paddingSymmetric}
              onChange={handlePaddingSymmetricChange}
              className="w-full p-2 border border-gray-300 rounded-lg no-spinner focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </label>
        </div>
      )}
      {paddingMode === "custom" && (
        <>
          <div className="flex gap-2 py-4">
            <label className="w-[45%]">
              บน (px)
              <input
                type="number"
                value={paddingTop}
                onChange={handlePaddingTopChange}
                className="w-full p-2 border border-gray-300 rounded-lg no-spinner focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </label>
            <label className="w-[45%]">
              ล่าง (px)
              <input
                type="number"
                value={paddingBottom}
                onChange={handlePaddingBottomChange}
                className="w-full p-2 border border-gray-300 rounded-lg no-spinner focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </label>
          </div>
          <div className="flex gap-2 py-4">
            <label className="w-[45%]">
              ซ้าย (px)
              <input
                type="number"
                value={paddingLeft}
                onChange={handlePaddingLeftChange}
                className="w-full p-2 border border-gray-300 rounded-lg no-spinner focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </label>
            <label className="w-[45%]">
              ขวา (px)
              <input
                type="number"
                value={paddingRight}
                onChange={handlePaddingRightChange}
                className="w-full p-2 border border-gray-300 rounded-lg no-spinner focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </label>
          </div>
        </>
      )}
      <Button
        variant="contained"
        sx={{ backgroundColor: "#4f46e5", "&:hover": { backgroundColor: "#3730a3" } }}
        onClick={handleSavePadding}
      >
        Apply Padding
      </Button>
    </div>
  );
};

export default PaddingTab;
