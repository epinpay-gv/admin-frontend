"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "light";

  return (
    <>
      <style>{`
        .theme-toggle-label {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          cursor: pointer;
          line-height: 1;
        }
        .theme-toggle-input {
          display: none;
        }
        .theme-icon {
          grid-column: 1 / 1;
          grid-row: 1 / 1;
          transition: transform 500ms;
          line-height: 0.1;
        }
        .theme-icon--moon {
          transition-delay: 200ms;
          color: #b4b4b4;
        }
        .theme-icon--sun {
          transform: scale(0);
          color: #ffa500;
        }
        .theme-toggle-input:checked + .theme-icon--moon {
          transform: rotate(360deg) scale(0);
          transition-delay: 0ms;
        }
        .theme-toggle-input:checked ~ .theme-icon--sun {
          transition-delay: 200ms;
          transform: scale(1) rotate(360deg);
        }
      `}</style>

      <label
        htmlFor="theme-switch"
        className="theme-toggle-label"
        suppressHydrationWarning
      >
        <input
          type="checkbox"
          id="theme-switch"
          className="theme-toggle-input"
          checked={isDark}
          onChange={() => setTheme(isDark ? "dark" : "light")}
          suppressHydrationWarning
        />
        <span className="theme-icon theme-icon--moon">
          <Moon size={18} />
        </span>
        <span className="theme-icon theme-icon--sun">
          <Sun size={18} />
        </span>
      </label>
    </>
  );
}