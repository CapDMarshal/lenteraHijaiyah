import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  wrapperClassName?: string;
  endAdornment?: ReactNode;
};

export function TextField({
  className,
  wrapperClassName,
  endAdornment,
  ...props
}: TextFieldProps) {
  return (
    <div
      className={cn(
        "flex h-14 w-full items-center rounded-xl border-2 border-stone-900 bg-[#F7EDE8] px-4 shadow-[2px_2px_0_#2b2b2b]",
        wrapperClassName,
      )}
    >
      <input
        className={cn(
          "w-full bg-transparent text-sm font-medium text-stone-900 placeholder:text-stone-500 focus:outline-none",
          className,
        )}
        {...props}
      />
      {endAdornment ? <span className="ml-3 inline-flex text-stone-700">{endAdornment}</span> : null}
    </div>
  );
}
