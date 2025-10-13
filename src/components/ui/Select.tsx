/** @format */

// src/components/ui/Select.tsx
import React, { forwardRef } from "react";
import ReactSelect, {
  Props as ReactSelectProps,
  SingleValue,
  MultiValue,
} from "react-select";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps
  extends Omit<
    ReactSelectProps<SelectOption>,
    "options" | "onChange" | "onBlur"
  > {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  native?: boolean;
  onChange?: (event: any) => void;
  onBlur?: (event: any) => void;
  value?: any;
  name?: string;
}

export const Select = forwardRef<any, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      native = false,
      className = "",
      onChange,
      onBlur,
      value,
      name,
      ...props
    },
    ref
  ) => {
    if (native) {
      return (
        <div className="form-control w-full">
          {label && (
            <label className="label">
              <span className="label-text font-medium">{label}</span>
            </label>
          )}
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <select
            ref={ref as React.Ref<HTMLSelectElement>}
            className={`select select-bordered w-full ${error ? "select-error" : ""
              } ${className}`}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            name={name}
            {...props}
          >
            <option value="">Select an option</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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

    const customStyles = {
      control: (provided: any, state: any) => ({
        ...provided,
        borderColor: error
          ? "#f87171"
          : state.isFocused
            ? "#3b82f6"
            : "#d1d5db",
        "&:hover": {
          borderColor: error ? "#f87171" : "#3b82f6",
        },
        boxShadow: "none",
        minHeight: "48px",
      }),
    };

    // Convert value for react-select
    const reactSelectValue = value
      ? Array.isArray(value)
        ? value.length > 0
          ? value.map((val: any) => {
            // If val is already an object with value property, find matching option
            const matchValue = typeof val === 'object' && val.value !== undefined ? val.value : val;
            return options.find((option) => option.value === matchValue);
          }).filter((item): item is SelectOption => item !== undefined)
          : []
        : options.find((option) => option.value === value) || null
      : props.isMulti ? [] : null;


    // Handle react-select onChange
    const handleReactSelectChange = (
      newValue: SingleValue<SelectOption> | MultiValue<SelectOption>
    ) => {
      if (onChange) {
        // For multi-select, we need to pass the full objects, not just values
        // For single-select, we pass just the value
        const selectedValue = Array.isArray(newValue)
          ? newValue // Keep full objects for multi-select
          : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          newValue?.value || "";

        // Create synthetic event for React Hook Form compatibility
        const syntheticEvent = {
          target: {
            value: selectedValue,
            name: name,
          },
          type: "change",
        };

        onChange(syntheticEvent as any);
      }
    };

    // Handle react-select onBlur
    const handleReactSelectBlur = () => {
      if (onBlur) {
        // Create synthetic event for React Hook Form compatibility
        const syntheticEvent = {
          target: {
            name: name,
          },
          type: "blur",
        };

        onBlur(syntheticEvent as any);
      }
    };

    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text font-medium">{label}</span>
          </label>
        )}
        <ReactSelect
          ref={ref}
          options={options}
          styles={customStyles}
          className={className}
          placeholder="Select an option..."
          value={reactSelectValue}
          onChange={handleReactSelectChange}
          onBlur={handleReactSelectBlur}
          name={name}
          {...props}
        />
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

Select.displayName = "Select";
