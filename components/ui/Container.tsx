import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "wide" | "narrow";
}

const SIZE_CLASSES: Record<NonNullable<ContainerProps["size"]>, string> = {
  narrow: "max-w-[720px]",
  default: "max-w-[1200px]",
  wide: "max-w-[1440px]",
};

export function Container({
  children,
  className,
  size = "default",
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-6 md:px-12",
        SIZE_CLASSES[size],
        className
      )}
    >
      {children}
    </div>
  );
}
