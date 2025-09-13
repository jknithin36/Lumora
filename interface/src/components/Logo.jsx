import React from "react";
import { cn } from "@/lib/utils";

/**
 * Props:
 * - size: number (icon size in px) -> default 24
 * - withTagline: boolean -> default false
 * - className: tailwind classes for wrapper
 * - accentClass: tailwind classes for icon color -> default "text-primary"
 * - textClass: tailwind classes for brand text -> default "text-fg"
 * - taglineClass: tailwind classes for tagline -> default "text-muted-foreground"
 */
const Logo = ({
  size = 24,
  withTagline = false,
  className,
  accentClass = "text-primary",
  textClass = "text-fg",
  taglineClass = "text-muted-foreground",
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Icon (tight SVG, no extra padding) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={cn("shrink-0", accentClass)}
        aria-hidden="true"
      >
        {/* Lumora mark: geometric knot */}
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3.6" />
          <path
            d="M12 2.8c-5.07 0-9.2 4.13-9.2 9.2s4.13 9.2 9.2 9.2 9.2-4.13 9.2-9.2-4.13-9.2-9.2-9.2z"
            opacity=".35"
          />
          <path
            d="M6.2 6.2 9 9M17.8 6.2 15 9M6.2 17.8 9 15M17.8 17.8 15 15"
            opacity=".8"
          />
        </g>
      </svg>

      {/* Wordmark + optional tagline */}
      <div className="leading-tight">
        <div className={cn("font-semibold tracking-tight", textClass)}>
          Lumora
        </div>
        {withTagline && (
          <div className={cn("text-xs", taglineClass)}>
            Illuminate Your Ideas
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;
