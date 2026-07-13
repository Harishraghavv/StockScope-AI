"use client";

import { forwardRef, InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, id, className = "", ...props }, ref) => {
    const fieldId = id || props.name;
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={fieldId}
          className="text-sm font-medium text-ink/80 dark:text-paper/80"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink/35 transition-colors
            focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20
            disabled:cursor-not-allowed disabled:opacity-60
            dark:bg-surface-dark dark:text-paper dark:placeholder:text-paper/30
            ${error ? "border-fall/60 focus:border-fall focus:ring-fall/15" : "border-ink/12 dark:border-paper/15"}
            ${className}`}
          {...props}
        />
        {error ? (
          <p id={`${fieldId}-error`} className="text-sm text-fall">
            {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-ink/45 dark:text-paper/40">{hint}</p>
        ) : null}
      </div>
    );
  }
);

FormField.displayName = "FormField";
export default FormField;
