"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: { value: number; label: string };
  className?: string;
  onClick?: () => void;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-blue-400",
  trend,
  className,
  onClick,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={cn(
        "bg-gray-800 border border-gray-700 rounded-xl p-5",
        onClick && "cursor-pointer hover:border-gray-600 transition-colors",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.value > 0
                    ? "text-emerald-400"
                    : trend.value < 0
                    ? "text-red-400"
                    : "text-gray-400"
                )}
              >
                {trend.value > 0 ? "+" : ""}
                {trend.value}
              </span>
              <span className="text-xs text-gray-500">{trend.label}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="bg-gray-900 rounded-lg p-2.5 ml-3">
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
