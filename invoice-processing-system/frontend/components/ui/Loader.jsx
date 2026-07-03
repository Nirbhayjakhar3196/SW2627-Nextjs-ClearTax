import React from "react";

const Loader = ({ size = "md" }) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`
        ${sizes[size]}
        border-blue-600
        border-t-transparent
        rounded-full
        animate-spin
      `}
    ></div>
  );
};

export default Loader;