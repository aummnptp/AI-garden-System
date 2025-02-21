import React from "react";

export const StepIndicator: React.FC<{ steps: string[]; currentStep: number }> = ({
    steps,
    currentStep,
  }) => (
    <div className="flex items-center justify-between w-full px-20 py-4 my-4">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const bgColor =
          currentStep > stepNumber
            ? "bg-green-500"
            : currentStep === stepNumber
            ? "bg-blue-500"
            : "bg-gray-400";
        return (
          <React.Fragment key={index}>
            <div className="flex items-center space-x-2">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${bgColor} text-white`}>
                {currentStep > stepNumber ? <i className="bi bi-check"></i> : stepNumber}
              </div>
              <span className={currentStep >= stepNumber ? "text-black" : "text-gray-400"}>
                {label}
              </span>
            </div>
            {index < steps.length - 1 && <div className="flex-1 h-0.5 bg-gray-300 mx-2" />}
          </React.Fragment>
        );
      })}
    </div>
  );