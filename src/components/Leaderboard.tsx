import { money } from "@/lib/api";
import { Crown } from "lucide-react";

export function Leaderboard({
  rows,
  currentEmail,
}: {
  rows: { user: any; total: number }[];
  currentEmail?: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-warning to-destructive text-white grid place-items-center">
          <Crown className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-extrabold">Top Performers</h3>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Iss month abhi tak koi sale nahi.</p>
      ) : (
        <ol className="space-y-2">
          {rows.map((r, i) => {
            const me =
              currentEmail && String(r.user.email).toLowerCase() === currentEmail.toLowerCase();
            return (
              <li
                key={r.user.id || i}
                className={`flex items-center gap-3 p-3 rounded-2xl border ${
                  me ? "border-primary/40 bg-primary/5" : "border-border bg-secondary/40"
                }`}
              >
                <span
                  className={`w-8 h-8 grid place-items-center rounded-full font-extrabold text-xs ${
                    i === 0
                      ? "bg-gradient-to-br from-warning to-destructive text-white"
                      : i === 1
                        ? "bg-secondary text-foreground"
                        : i === 2
                          ? "bg-accent/20 text-accent"
                          : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">
                    {r.user.name} {me && <span className="text-xs text-primary">(You)</span>}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{r.user.referralCode}</p>
                </div>
                <span className="font-extrabold text-success">{money(r.total)}</span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
