import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  approvable: "bg-emerald-100 text-emerald-900",
  observe: "bg-amber-100 text-amber-900",
  reject: "bg-rose-100 text-rose-900",
  manual_review: "bg-slate-200 text-slate-900",
  completed: "bg-emerald-100 text-emerald-900",
  needs_attention: "bg-amber-100 text-amber-900",
  processing: "bg-blue-100 text-blue-900",
  failed: "bg-rose-100 text-rose-900",
  draft: "bg-slate-100 text-slate-900",
};

export function StatusPill({
  value,
  label,
}: {
  value: string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
        tones[value] ?? "bg-slate-100 text-slate-900",
      )}
    >
      {label ?? value}
    </span>
  );
}
