import type React from "react";
import type { FC } from "react";

interface InputProps {
  label?: string;
  type?: "text" | "number" | "email" | "password" | "date" | "time" | "textarea" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement, MouseEvent>) => void;
  className?: string;
  min?: string;
  max?: string;
  step?: number;
  rows?: number;
  disabled?: boolean;
  readOnly?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
}

const Input: FC<InputProps> = ({
  label,
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  onClick,
  className = "",
  min,
  max,
  step,
  rows,
  disabled = false,
  readOnly = false,
  success = false,
  error = false,
  hint,
}) => {
  let baseClasses = `w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${className}`;

  if (disabled) {
    baseClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 opacity-40`;
  } else if (error) {
    baseClasses += ` border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
  } else if (success) {
    baseClasses += ` border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
  } else {
    baseClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800`;
  }

  return (
    <div className="relative">
      {label && (
        <label htmlFor={id || name} className="block mb-1 text-sm font-medium text-gray-700 dark:text-white/80">
          {label}
        </label>
      )}

      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          rows={rows}
          value={value as string | undefined} // textarea expects string value
          onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
          onClick={onClick}
          disabled={disabled}
          readOnly={readOnly}
          className={`${baseClasses} min-h-[80px] resize-y`} // default height & resizable
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
          onClick={onClick}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          readOnly={readOnly}
          className={`${baseClasses} h-11`}
        />
      )}

      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error ? "text-error-500" : success ? "text-success-500" : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
