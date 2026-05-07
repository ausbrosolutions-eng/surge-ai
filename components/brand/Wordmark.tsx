import { cn } from "@/lib/utils";

interface WordmarkProps {
  variant?: "default" | "white" | "ink";
  size?: "sm" | "md" | "lg";
  showDot?: boolean;
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<WordmarkProps["size"]>, string> = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl",
};

const COLOR_CLASSES: Record<NonNullable<WordmarkProps["variant"]>, string> = {
  default: "text-copper",
  white: "text-ink-primary",
  ink: "text-page",
};

const DOT_CLASSES: Record<NonNullable<WordmarkProps["variant"]>, string> = {
  default: "bg-copper",
  white: "bg-copper",
  ink: "bg-copper",
};

export function Wordmark({
  variant = "default",
  size = "md",
  showDot = true,
  className,
}: WordmarkProps) {
  const dotSize =
    size === "sm" ? "h-1 w-1" : size === "md" ? "h-1.5 w-1.5" : "h-2 w-2";

  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-1.5 font-display font-bold tracking-[-0.04em] leading-none",
        SIZE_CLASSES[size],
        COLOR_CLASSES[variant],
        className
      )}
    >
      surge advisory
      {showDot && (
        <span
          className={cn("inline-block rounded-full", DOT_CLASSES[variant], dotSize)}
          aria-hidden
        />
      )}
    </span>
  );
}
