"use client";

import { useNotificationSound } from "@/hook/useNotificationSound";
import { IAccessibility } from "@/Interface/ISettings";
import { useEffect } from "react";

type AccessibilityProps = {
  accessibility: IAccessibility;
  onAccessibilityChange: (changes: Partial<IAccessibility>) => void;
};

function Accessibility({
  accessibility,
  onAccessibilityChange,
}: AccessibilityProps) {
  const playNotification = useNotificationSound();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute(
        "data-textSize",
        accessibility.textSize,
      );
    }
  }, [accessibility.textSize]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const htmlElement = document.documentElement;
      const toggleClass = (className: string, condition: boolean) => {
        if (condition) {
          htmlElement.classList.add(className);
        } else {
          htmlElement.classList.remove(className);
        }
      };

      toggleClass("high-contrast", accessibility.highContrast);
      toggleClass("notification-sound", accessibility.notificationSound);
      toggleClass("dyslexic-font", accessibility.dyslexicFont);
    }
  }, [
    accessibility.highContrast,
    accessibility.notificationSound,
    accessibility.dyslexicFont,
  ]);

  return (
    <div className="bg-base-300 mb-8 w-full rounded-xl p-4 shadow-md sm:p-6">
      <h2 className="mb-4 text-xl font-bold">Accessibility</h2>

      <div className="space-y-6">
        {/* Text size */}
        <div className="flex items-center justify-between">
          <span>Text size</span>
          <div className="join">
            {["small", "medium", "large"].map((size) => (
              <button
                type="button"
                key={size}
                className={`btn btn-sm join-item btn-outline ${accessibility.textSize === size ? "btn-active border-blue-500 text-blue-600" : ""}`}
                onClick={() =>
                  onAccessibilityChange({
                    textSize: size as "small" | "medium" | "large",
                  })
                }
              >
                A
              </button>
            ))}
          </div>
        </div>

        {/* High contrast */}
        <div className="flex items-center justify-between">
          <span>High contrast</span>
          <input
            type="checkbox"
            className="toggle toggle-md"
            checked={accessibility.highContrast}
            onChange={(e) =>
              onAccessibilityChange({ highContrast: e.target.checked })
            }
          />
        </div>

        {/* Notification sound */}
        <div className="flex items-center justify-between">
          <span>Notification sound</span>
          <input
            type="checkbox"
            className="toggle toggle-md"
            checked={accessibility.notificationSound}
            onChange={(e) => {
              onAccessibilityChange({ notificationSound: e.target.checked });
              playNotification();
            }}
          />
        </div>

        {/* Dyslexic font */}
        <div className="flex items-center justify-between">
          <span>Dyslexic font</span>
          <input
            type="checkbox"
            className="toggle toggle-md"
            checked={accessibility.dyslexicFont}
            onChange={(e) =>
              onAccessibilityChange({ dyslexicFont: e.target.checked })
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Accessibility;
