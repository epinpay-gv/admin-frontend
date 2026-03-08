"use client";

import { Search, X } from "lucide-react";
import Input from "@/components/common/input/Input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Ara...",
  className,
  autoFocus,
}: SearchInputProps) {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      leftIcon={<Search size={14} />}
      rightIcon={
        value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="transition-colors"
            style={{ color: "rgba(255,255,255,0.1)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.1)")}
          >
            <X size={13} />
          </button>
        ) : null
      }
      className={className}
    />
  );
}