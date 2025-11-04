// FormElementWithIcon.jsx

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

const FormElementWithIcon = ({
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  options = [],
  required = false,
  showPasswordToggle = false,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const renderInput = () => {
    if (type === "select") {
      return (
        <select
          value={value}
          onChange={onChange}
          className={`bg-[#5271FF] w-full border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-12 pl-10 focus:ring-2 focus:ring-[#5271FF]/50 ${className}`}
          required={required}
        >
          <option value="" className="mb-2 !text-white/70">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="mb-2">
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (type === "password" && showPasswordToggle) {
      return (
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-12 pl-10 pr-10 focus:ring-2 focus:ring-[#5271FF]/50 ${className}`}
            required={required}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      );
    }

    return (
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-12 pl-10 focus:ring-2 focus:ring-[#5271FF]/50 ${className}`}
        required={required}
      />
    );
  };

  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4" />
      {renderInput()}
    </div>
  );
};

export default FormElementWithIcon;