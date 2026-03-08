"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  hint?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZE_STYLES = {
  sm: {
    root: "h-4 w-7",
    thumb: "h-3 w-3 data-[state=checked]:translate-x-3",
  },
  md: {
    root: "h-5 w-9",
    thumb: "h-4 w-4 data-[state=checked]:translate-x-4",
  },
  lg: {
    root: "h-6 w-11",
    thumb: "h-5 w-5 data-[state=checked]:translate-x-5",
  },
};

export default function Switch({
  checked,
  onCheckedChange,
  label,
  hint,
  disabled,
  size = "md",
}: SwitchProps) {
  const sizeStyle = SIZE_STYLES[size];

  return (
    <div className="flex items-center gap-3">
      <SwitchPrimitive.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent",
          "transition-all duration-200 outline-none",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "data-[state=unchecked]:bg-white/10",
          sizeStyle.root
        )}
        style={
          checked
            ? { background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }
            : undefined
        }
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "pointer-events-none block rounded-full bg-white shadow-lg",
            "transition-transform duration-200 translate-x-0",
            sizeStyle.thumb
          )}
        />
      </SwitchPrimitive.Root>

      {(label || hint) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-white/70">{label}</span>
          )}
          {hint && (
            <span className="text-xs font-mono text-white/30">{hint}</span>
          )}
        </div>
      )}
    </div>
  );
}