import { money } from "@/lib/api";
import { Trophy, Clock } from "lucide-react";

export function BonusProgress({
  monthlySales,
  bonusPct,
  daysLeft,
}: {
  monthlySales: number;
  bonusPct: number;
  daysLeft: number;
}) {
  const t1 = 5000;
  const t2 = 20000;
  const pct1 = Math.min(100, (monthlySales / t1) * 100);
  const pct2 = Math.min(100, (monthlySales / t2) * 100);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-brand text-white grid place-items-center">
            <Trophy className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-extrabold">Monthly Performance Bonus</h3>
        </div>
        <span className="text-xs font-bold text-muted-foreground inline-flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> {daysLeft} days left
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        Current month verified sales: <b className="text-foreground">{money(monthlySales)}</b> ·
        Active tier: <b className="text-success">{bonusPct}%</b>
      </p>

      <Tier label="Tier 1" target={t1} bonus="10%" pct={pct1} active={monthlySales >= t1} />
      <Tier label="Tier 2" target={t2} bonus="20%" pct={pct2} active={monthlySales >= t2} />

      <div className="mt-4 rounded-2xl bg-secondary/60 p-3 text-xs text-muted-foreground">
        🏆 Top performers monthly leaderboard pe extra rewards bhi paayenge.
      </div>
    </div>
  );
}

function Tier({
  label,
  target,
  bonus,
  pct,
  active,
}: {
  label: string;
  target: number;
  bonus: string;
  pct: number;
  active: boolean;
}) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs font-bold mb-1.5">
        <span className={active ? "text-success" : "text-muted-foreground"}>
          {label} · {money(target)} → {bonus} bonus
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full ${active ? "bg-gradient-to-r from-success to-accent" : "bg-gradient-brand"} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
