import React from "react";
import { RotateLeft, RotateRight, SwapHoriz, SwapVert } from "@mui/icons-material";

interface RotationTabProps {
  onRotateLeft: () => void;
  onRotateRight: () => void;
  toggleFlipHorizontal: () => void;
  toggleFlipVertical: () => void;
}

const RotationTab: React.FC<RotationTabProps> = ({
  onRotateLeft,
  onRotateRight,
  toggleFlipHorizontal,
  toggleFlipVertical,
}) => {
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-4 justify-between py-4 w-full">
        <div
          onClick={onRotateLeft}
          className="flex flex-col items-center justify-center space-y-2 w-[20%] cursor-pointer"
        >
          <div className="flex items-center justify-center w-full h-20 rounded-lg border border-gray-300 shadow-lg hover:bg-gray-100 hover:text-blue-700">
            <RotateLeft fontSize="large" />
          </div>
          <p className="text-center text-sm font-medium">RotateLeft (-90°)</p>
        </div>
        <div
          onClick={onRotateRight}
          className="flex flex-col items-center justify-center space-y-2 w-[20%] cursor-pointer"
        >
          <div className="flex items-center justify-center w-full h-20 rounded-lg border border-gray-300 shadow-lg hover:bg-gray-100 hover:text-blue-700">
            <RotateRight fontSize="large" />
          </div>
          <p className="text-center text-sm font-medium">RotateRight (+90°)</p>
        </div>
        <div
          onClick={toggleFlipHorizontal}
          className="flex flex-col items-center justify-center space-y-2 w-[20%] cursor-pointer"
        >
          <div className="flex items-center justify-center w-full h-20 rounded-lg border border-gray-300 shadow-lg hover:bg-gray-100 hover:text-blue-700">
            <SwapHoriz fontSize="large" />
          </div>
          <p className="text-center text-sm font-medium">Flip Horizontal</p>
        </div>
        <div
          onClick={toggleFlipVertical}
          className="flex flex-col items-center justify-center space-y-2 w-[20%] cursor-pointer"
        >
          <div className="flex items-center justify-center w-full h-20 rounded-lg border border-gray-300 shadow-lg hover:bg-gray-100 hover:text-blue-700">
            <SwapVert fontSize="large" />
          </div>
          <p className="text-center text-sm font-medium">Flip Vertical</p>
        </div>
      </div>
    </div>
  );
};

export default RotationTab;
