import { cn } from "@/lib/utils";

interface MarkProps {
  size?: number;
  className?: string;
}

export function Mark({ size = 32, className }: MarkProps) {
  return (
    <span
      className={cn("inline-block rounded-full bg-copper", className)}
      style={{ width: size, height: size }}
      aria-label="Surge Advisory"
      role="img"
    />
  );
}
