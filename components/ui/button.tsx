import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ink";
type ButtonSize = "sm" | "md" | "lg" | "nav" | "hero";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  frontClassName?: string;
};

type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

type LinkButtonProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    frontClassName?: string;
    children: ReactNode;
  };

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleOptions = {}) {
  return cn(
    "group inline-flex rounded-md p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    variant === "primary" && "bg-lime-900 focus-visible:ring-lime-500",
    variant === "secondary" && "bg-stone-300 focus-visible:ring-stone-400",
    variant === "ink" && "bg-[#d96852] focus-visible:ring-red-500",
    "disabled:cursor-not-allowed disabled:opacity-70",
    "[&>span]:transition-transform [&>span]:duration-200 [&>span]:ease-out",
    size === "sm" && "px-3 py-1.5 text-xs",
    size === "md" && "px-4 py-2 text-sm",
    size === "lg" && "px-6 py-3 text-base",
    size === "nav" && "rounded-[10px]",
    size === "hero" && "rounded-[12px]",
    className,
  );
}

export function buttonFrontStyles({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleOptions = {}) {
  return cn(
    "inline-flex items-center justify-center rounded-[inherit] font-semibold",
    variant !== "ink" && "-translate-y-1.5 group-hover:-translate-y-2 group-active:-translate-y-0.5",
    variant === "ink" && "-translate-x-1 -translate-y-1 group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 group-active:-translate-x-0.5 group-active:-translate-y-0.5",
    variant === "primary" && "bg-lime-700 text-white",
    variant === "secondary" && "bg-white text-stone-800 border border-stone-300",
    variant === "ink" && "bg-black text-white",
    size === "sm" && "px-3 py-1.5 text-xs",
    size === "md" && "px-4 py-2 text-sm",
    size === "lg" && "px-6 py-3 text-base",
    size === "nav" && "px-8 py-2.5 text-sm",
    size === "hero" && "px-9 py-3 text-lg",
    className,
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  frontClassName,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonStyles({ variant, size, className })} {...props}>
      <span className={buttonFrontStyles({ variant, size, className: frontClassName })}>
        {children}
      </span>
    </button>
  );
}

export function LinkButton({
  className,
  variant = "primary",
  size = "md",
  frontClassName,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link className={buttonStyles({ variant, size, className })} {...props}>
      <span className={buttonFrontStyles({ variant, size, className: frontClassName })}>
        {children}
      </span>
    </Link>
  );
}
