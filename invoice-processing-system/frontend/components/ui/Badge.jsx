import React from "react";

const Badge = ({ status }) => {
  const statusStyles = {
    Matched: "bg-green-100 text-green-700",
    Mismatched: "bg-red-100 text-red-700",
    Processing: "bg-yellow-100 text-yellow-700",
    Pending: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`
        inline-block
        px-3
        py-1
        rounded-full
        text-sm
        font-medium
        ${statusStyles[status] || "bg-gray-100 text-gray-700"}
      `}
    >
      {status}
    </span>
  );
};

export default Badge;