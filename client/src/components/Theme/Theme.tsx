"use client";

import { useEffect } from "react";

interface ThemeProps {
  theme: string;
  onThemeChange: (newTheme: string) => void;
}

function Theme({ theme, onThemeChange }: ThemeProps) {

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return (
    <div className="mb-8 w-full rounded-xl bg-base-300 sm:p-6 p-4 shadow-md">
      <h2 className="text-xl font-bold mb-4">Theme</h2>

      <div className="flex space-x-4">
        {/* Light button */}
        <button
          type="button"
          className={`btn flex items-center space-x-2 ${
            theme === "light" ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => onThemeChange("light")}
        >
          <span>☀️</span>
          <span>Light</span>
        </button>

        {/* Dark button */}
        <button
        type="button"
          className={`btn flex items-center space-x-2 ${
            theme === "dark" ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => onThemeChange("dark")}
        >
          <span>🌙</span>
          <span>Dark</span>
        </button>
      </div>
    </div>
  );
}

export default Theme;