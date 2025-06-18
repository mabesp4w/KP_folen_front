/** @format */

// src/components/ui/Input.tsx
import React, { forwardRef } from "react";
import { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      iconPosition = "left",
      className = "",
      ...props
    },
    ref
  ) => {
    const hasIcon = !!Icon;
    const inputClasses = `input input-bordered w-full ${
      error ? "input-error" : ""
    } ${
      hasIcon ? (iconPosition === "left" ? "pl-10" : "pr-10") : ""
    } ${className}`;

    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text font-medium">{label}</span>
          </label>
        )}
        <div className="relative">
          {Icon && iconPosition === "left" && (
            <Icon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          )}
          <input ref={ref} className={inputClasses} {...props} />
          {Icon && iconPosition === "right" && (
            <Icon
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          )}
        </div>
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
        {helperText && !error && (
          <label className="label">
            <span className="label-text-alt text-gray-500">{helperText}</span>
          </label>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
