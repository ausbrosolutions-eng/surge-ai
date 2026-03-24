"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  score: number;
  label?: string;
  size?: number;
  showGrade?: boolean;
  className?: string;
}

function getColor(score: number) {
  if (score >= 80) return { stroke: "#10b981", text: "text-emerald-400", grade: "A", label: "Excellent" };
  if (score >= 65) return { stroke: "#f59e0b", text: "text-amber-400", grade: "B", label: "Good" };
  if (score >= 45) return { stroke: "#f97316", text: "text-orange-400", grade: "C", label: "Needs Work" };
  return { stroke: "#ef4444", text: "text-red-400", grade: "D", label: "Critical" };
}

export default function ScoreGauge({ score, label, size = 120, showGrade = true, className }: Props) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  // Only fill 75% of circle (270 degrees = 3/4)
  const arcLength = circumference * 0.75;
  const offset = arcLength - (arcLength * Math.min(score, 100)) / 100;
  const { stroke, text, grade, label: gradeLabel } = getColor(score);

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-[135deg]"
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1f2937"
            strokeWidth={8}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Fill */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth={8}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold leading-none", text, size >= 100 ? "text-2xl" : "text-lg")}>
            {score}
          </span>
          {showGrade && (
            <span className="text-xs text-gray-500 mt-0.5">{grade}</span>
          )}
        </div>
      </div>
      {label && <p className="text-xs text-gray-400 text-center leading-tight">{label}</p>}
      {showGrade && (
        <span className={cn("text-xs font-medium", text)}>{gradeLabel}</span>
      )}
    </div>
  );
}
