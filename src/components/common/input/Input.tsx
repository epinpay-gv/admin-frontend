"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type InputState = "default" | "error" | "success";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  success?: string;
  state?: InputState;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const STATE_STYLES: Record<InputState, string> = {
  default: "focus-visible:border-[#00C6A2]/50 focus-visible:ring-[#00C6A2]/20",
  error: "focus-visible:border-red-500/70 focus-visible:ring-red-500/20",
  success: "focus-visible:border-emerald-500/70 focus-visible:ring-emerald-500/20",
};

const STATE_BORDER: Record<InputState, string> = {
  default: "var(--border)",
  error: "rgba(239,68,68,0.5)",
  success: "rgba(16,185,129,0.5)",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      success,
      state = "default",
      leftIcon,
      rightIcon,
      type,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;
    const resolvedState: InputState = error ? "error" : success ? "success" : state;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            className="text-[11px] font-semibold uppercase tracking-widest font-mono"
            style={{ color: "var(--text-muted)" }}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            type={resolvedType}
            disabled={disabled}
            className={cn(
              "w-full h-11 rounded-lg border px-3 py-2 text-sm outline-none transition-all",
              "focus-visible:ring-2 focus-visible:outline-none",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              STATE_STYLES[resolvedState],
              leftIcon && "pl-9",
              (rightIcon || isPassword || error || success) && "pr-9",
              className
            )}
            style={{
              background: "var(--background-card)",
              borderColor: STATE_BORDER[resolvedState],
              color: "var(--text-primary)",
            }}
            {...props}
          />

          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {isPassword ? (
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            ) : error ? (
              <AlertCircle size={15} className="text-red-400" />
            ) : success ? (
              <CheckCircle2 size={15} className="text-emerald-400" />
            ) : rightIcon ? (
              <span style={{ color: "var(--text-muted)" }}>{rightIcon}</span>
            ) : null}
          </span>
        </div>

        {error ? (
          <p className="text-xs text-red-400 font-mono">{error}</p>
        ) : success ? (
          <p className="text-xs text-emerald-400 font-mono">{success}</p>
        ) : hint ? (
          <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;