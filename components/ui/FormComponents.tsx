"use client";

import { AlertCircle } from "lucide-react";

/**
 * Error message component for form validation errors
 */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="flex items-center gap-1.5 text-xs text-rose mt-1.5">
      <AlertCircle
        strokeWidth={1.5}
        className="h-3.5 w-3.5 shrink-0"
        aria-hidden="true"
      />
      {message}
    </p>
  );
}

/**
 * Reusable form input field component
 */
export function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-cocoa">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`rounded-xl border bg-cream px-4 py-3 text-sm text-cocoa placeholder:text-muted transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose ${
          error ? "border-rose bg-rose/5" : "border-border"
        }`}
      />
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-center gap-1.5 text-xs text-rose">
          <AlertCircle
            strokeWidth={1.5}
            className="h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
          />
          {error}
        </p>
      )}
    </div>
  );
}
