"use client";

import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, icon: Icon, type = "text", className = "", ...props },
  ref
) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-stone-700 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 group-focus-within:text-[#9670f8] transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`block w-full ${Icon ? "pl-10" : "pl-3"} pr-3 py-3 border ${
            error ? "border-red-300 focus:ring-red-400" : "border-stone-200 focus:ring-[#9670f8]"
          } rounded-xl focus:ring-2 focus:border-transparent transition-all outline-none text-stone-900 bg-white shadow-sm ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

export default Input;
