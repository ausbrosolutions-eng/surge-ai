"use client";

import { forwardRef } from "react";

interface FieldWrapperProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function FieldWrapper({ label, required, error, hint, children }: FieldWrapperProps) {
  return (
    <div className="space-y-1.5">
      <label className="block font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086]">
        {label}
        {required && <span className="text-[#B87333] ml-1">*</span>}
      </label>
      {children}
      {hint && !error && <p className="font-sans text-xs text-[#5A5550]">{hint}</p>}
      {error && <p className="font-sans text-xs text-[#EF4444]">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2.5 bg-[#0A0A0A] border border-[#2A2520] text-sm text-[#E8E2D8] placeholder-[#5A5550] rounded-[2px] transition-colors focus:outline-none focus:border-[#B87333]";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <input ref={ref} {...props} className={`${inputClass} ${props.className || ""}`} />
));
Input.displayName = "Input";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => (
  <textarea ref={ref} {...props} className={`${inputClass} ${props.className || ""}`} rows={props.rows || 3} />
));
Textarea.displayName = "Textarea";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;
export const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => (
  <select ref={ref} {...props} className={`${inputClass} ${props.className || ""}`} />
));
Select.displayName = "Select";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 px-4 py-2 font-display text-xs font-semibold tracking-[0.1em] uppercase rounded-[2px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-[#B87333] hover:bg-[#D4956A] text-[#0A0A0A]",
    secondary: "bg-[#1A1A1A] hover:bg-[#2A2520] text-[#E8E2D8] border border-[#2A2520]",
    ghost: "text-[#9A9086] hover:text-[#E8E2D8]",
  };
  return (
    <button {...props} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
