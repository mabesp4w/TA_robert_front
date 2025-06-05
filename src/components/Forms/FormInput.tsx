/** @format */

import { forwardRef } from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, required, className = "", ...props }, ref) => {
    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text">
              {label}
              {required && <span className="text-error ml-1">*</span>}
            </span>
          </label>
        )}

        <input
          ref={ref}
          className={`input input-bordered w-full ${
            error ? "input-error" : ""
          } ${className}`}
          {...props}
        />

        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}

        {hint && !error && (
          <label className="label">
            <span className="label-text-alt text-base-content/60">{hint}</span>
          </label>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
