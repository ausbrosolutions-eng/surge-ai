"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const widthClass = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({ open, onClose, title, subtitle, children, maxWidth = "md" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center pt-16 px-4"
      onClick={onClose}
    >
      <div
        className={`w-full ${widthClass[maxWidth]} bg-[#111111] border border-[#2A2520] rounded-[2px] shadow-2xl max-h-[85vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b border-[#2A2520] flex-shrink-0">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-[#E8E2D8]">
              {title}
            </h2>
            {subtitle && (
              <p className="font-sans text-xs text-[#9A9086] mt-1">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[#5A5550] hover:text-[#E8E2D8] text-2xl leading-none p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
