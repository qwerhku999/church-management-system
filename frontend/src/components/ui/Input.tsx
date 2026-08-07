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
          "focus-ring h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)]",
          error && "border-[var(--danger)]/60",
          className
        )}
        {...props}
      />
      {error ? <p className="mt-2 text-sm text-[var(--danger)]">{error}</p> : null}
    </div>
  )
);

Input.displayName = "Input";

export default Input;
