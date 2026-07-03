import React from "react";

const Input = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Input Field */}
      <input
        className={`
          w-full
          px-4
          py-2
          border
          rounded-lg
          outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-blue-500
          ${error ? "border-red-500" : "border-gray-300"}
          ${className}
        `}
        {...props}
      />

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;