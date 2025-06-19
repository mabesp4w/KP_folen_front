/** @format */

// src/components/ui/Input.tsx
import React, { forwardRef, useState } from "react";
import { LucideIcon, Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      iconPosition = "left",
      showPasswordToggle = false,
      type,
      className = "",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    // Determine if this is a password input
    const isPasswordInput = type === "password";
    const hasPasswordToggle = isPasswordInput && showPasswordToggle;

    // Determine actual input type
    const inputType = isPasswordInput && showPassword ? "text" : type;

    const hasLeftIcon = !!Icon && iconPosition === "left";
    const hasRightIcon = !!Icon && iconPosition === "right";
    const hasRightContent = hasRightIcon || hasPasswordToggle;

    // Calculate padding based on icons and password toggle
    let paddingClasses = "";
    if (hasLeftIcon) {
      paddingClasses += "pl-10 ";
    }
    if (hasRightContent) {
      paddingClasses += "pr-10 ";
    }

    const inputClasses = `input input-bordered w-full ${
      error ? "input-error" : ""
    } ${paddingClasses}${className}`;

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text font-medium">{label}</span>
          </label>
        )}
        <div className="relative">
          {/* Left Icon */}
          {hasLeftIcon && (
            <Icon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={inputType}
            className={inputClasses}
            {...props}
          />

          {/* Right Content (Icon or Password Toggle) */}
          {hasRightContent && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {hasPasswordToggle ? (
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              ) : hasRightIcon ? (
                <Icon className="text-gray-400" size={16} />
              ) : null}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}

        {/* Helper Text */}
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
