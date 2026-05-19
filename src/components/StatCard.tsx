import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent = "from-primary to-accent",
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  accent?: string;
}) {
  return (
    <div className="relative rounded-3xl border border-border bg-card/80 backdrop-blur-xl p-5 shadow-elegant overflow-hidden group">
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <h3 className="text-2xl md:text-3xl font-extrabold mt-1.5">{value}</h3>
          {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
        </div>
        {icon && (
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${accent} text-white grid place-items-center shadow-glow`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
