"use client";
import React from "react";

const PI = 3.141592653589793238462643383279502884;
export default function ProgressCircle({
  progress,
  children,
  color,
}: {
  progress: number;
  children: React.ReactNode;
  color: string;
}) {
  const size = 100; // overall viewBox size
  const strokeWidth = 3; // thicker stroke
  const center = size / 2;
  const radius = center - strokeWidth; // ensure the circle fits within the SVG
  const circumference = 2 * PI * radius;
  const offset = Number((circumference * (1 - progress)).toFixed(2));

  return (
    <div className="relative h-[90vw] max-h-[500px] w-[90vw] max-w-[500px] lg:h-[500px] lg:w-[500px]">
      <svg
        className="h-full w-full -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx={`${center}`}
          cy={`${center}`}
          r={radius}
          fill="none"
          className="stroke-current text-gray-200"
          style={{ color: color, opacity: 0.3 }}
          strokeWidth={`${strokeWidth}`}
        />
        <circle
          cx={`${center}`}
          cy={`${center}`}
          r={radius}
          fill="none"
          className="stroke-current"
          style={{ color: color }}
          strokeWidth={`${strokeWidth}`}
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${offset}`}
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
