export default function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-[var(--muted)]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
        <p className="text-sm">{label}</p>
      </div>
    </div>
  );
}
