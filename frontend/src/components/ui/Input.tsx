import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="w-full">
      {label ? <label className="mb-2 block text-sm font-medium text-[var(--text)]">{label}</label> : null}
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)]",
          error && "border-red-500/60",
          className
        )}
        {...props}
      />
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
    </div>
  )
);

Input.displayName = "Input";

export default Input;
