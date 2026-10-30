import { Slot } from "radix-ui";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg" | "icon" | "icon-sm";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const base =
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none " +
  "transition-[transform,background-color,color,box-shadow,border-color,opacity] duration-200 ease-expo " +
  "active:scale-[0.96] disabled:pointer-events-none disabled:opacity-45 " +
  "[&_svg]:size-[1.1em] [&_svg]:shrink-0";

const variants: Record<Variant, string> = {
  // The one signal color. Glow on hover, never a gradient.
  primary:
    "bg-lime text-on-lime rounded-full hover:shadow-[0_0_0_4px_var(--glow-lime),0_8px_32px_-8px_var(--glow-lime)]",
  secondary:
    "bg-fg text-bg rounded-full hover:shadow-[0_0_0_4px_var(--glow-violet),0_8px_32px_-8px_var(--glow-violet)]",
  outline:
    "border border-border bg-transparent text-fg rounded-full hover:border-fg/40 hover:bg-surface-2/60",
  ghost: "bg-transparent text-fg rounded-full hover:bg-surface-2",
  danger: "bg-transparent text-danger rounded-full hover:bg-danger/10",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.9375rem]",
  lg: "h-14 px-8 text-base",
  icon: "size-11",
  "icon-sm": "size-9",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: Pick<ButtonProps, "variant" | "size" | "className">) {
  return cn(base, variants[variant], sizes[size], className);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, asChild, className, type, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : "button";
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : (type ?? "button")}
        className={buttonClasses({ variant, size, className })}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
