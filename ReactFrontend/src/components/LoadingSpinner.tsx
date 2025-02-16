import React from "react";
import { CircularProgress } from "@mui/material";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <CircularProgress size={50} />
    </div>
  );
};

export default LoadingSpinner;