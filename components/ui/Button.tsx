import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "tertiary";

interface ButtonProps {
  href: string;
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-copper text-page font-semibold text-sm tracking-tight px-7 py-4 rounded-sm hover:bg-copper-dark transition-colors",
  secondary:
    "text-ink-secondary text-sm hover:text-copper transition-colors",
  tertiary:
    "border border-copper text-ink-primary font-mono uppercase tracking-[0.04em] text-xs px-4 py-2 rounded-sm hover:border-copper-dark hover:text-copper transition-colors",
};

export function Button({
  href,
  variant = "primary",
  children,
  className,
  external,
}: ButtonProps) {
  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Link
      href={href}
      className={cn(VARIANT_CLASSES[variant], "inline-flex items-center gap-2", className)}
      {...externalProps}
    >
      {children}
    </Link>
  );
}
