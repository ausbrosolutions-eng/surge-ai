import { cn } from "@/lib/utils";

interface EyebrowProps {
  number?: string;
  children: React.ReactNode;
  variant?: "copper" | "warm";
  className?: string;
}

export function Eyebrow({
  number,
  children,
  variant = "copper",
  className,
}: EyebrowProps) {
  return (
    <div
      className={cn(
        "font-mono uppercase tracking-[0.16em] text-[11px] font-medium",
        className
      )}
    >
      {number && (
        <span className="text-ink-secondary">{number} / </span>
      )}
      <span
        className={
          variant === "copper" ? "text-copper" : "text-ink-secondary"
        }
      >
        {children}
      </span>
    </div>
  );
}
