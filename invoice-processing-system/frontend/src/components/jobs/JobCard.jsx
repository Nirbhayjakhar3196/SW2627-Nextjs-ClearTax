import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`
        bg-white
        rounded-xl
        shadow-md
        p-6
        border
        border-gray-200
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
