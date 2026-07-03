import React from "react";

const ProgressBar = ({ progress = 0 }) => {
  return (
    <div className="w-full">
      {/* Progress Text */}
      <div className="flex justify-between mb-2 text-sm font-medium">
        <span>Processing...</span>
        <span>{progress}%</span>
      </div>

      {/* Progress Bar Background */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        {/* Filled Progress */}
        <div
          className="bg-blue-600 h-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;