import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, ...props }, ref) => (
    <div className="w-full">
      {label ? (
        <label className="mb-2 block text-sm font-medium text-[var(--text)]">{label}</label>
      ) : null}
      <select
        ref={ref}
        className={cn(
          "h-11 w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)]",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[var(--surface)]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
);

Select.displayName = "Select";

export default Select;
