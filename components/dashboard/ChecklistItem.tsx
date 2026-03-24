"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChecklistItem as ChecklistItemType } from "@/lib/types";
import StatusBadge from "./StatusBadge";

interface Props {
  item: ChecklistItemType;
  onToggle: (id: string) => void;
  onNoteChange?: (id: string, notes: string) => void;
}

export default function ChecklistItemRow({ item, onToggle, onNoteChange }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className={cn(
        "border rounded-lg transition-colors",
        item.completed
          ? "bg-gray-800/50 border-gray-700/50"
          : "bg-gray-800 border-gray-700 hover:border-gray-600"
      )}
    >
      <div className="flex items-start gap-3 p-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(item.id)}
          className={cn(
            "flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-0.5",
            item.completed
              ? "bg-emerald-500 border-emerald-500"
              : "border-gray-500 hover:border-emerald-500"
          )}
        >
          <AnimatePresence>
            {item.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                "text-sm font-medium leading-snug",
                item.completed ? "line-through text-gray-500" : "text-gray-200"
              )}
            >
              {item.title}
            </p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <StatusBadge variant={item.priority} size="sm" />
              <span className="text-xs text-gray-600">+{item.scoreWeight}pts</span>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                {expanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  {item.description}
                </p>
                {onNoteChange && (
                  <textarea
                    value={item.notes || ""}
                    onChange={(e) => onNoteChange(item.id, e.target.value)}
                    placeholder="Add notes..."
                    rows={2}
                    className="w-full mt-2 bg-gray-900 border border-gray-600 rounded text-xs text-gray-300 p-2 resize-none focus:outline-none focus:border-blue-500"
                  />
                )}
                {item.completedAt && (
                  <p className="text-xs text-gray-600 mt-1">
                    Completed {new Date(item.completedAt).toLocaleDateString()}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
