import { Link } from "@tanstack/react-router";
import { Lock, Wallet, TrendingUp, Network, Gift, ArrowRight } from "lucide-react";

const ITEMS = [
  {
    icon: TrendingUp,
    label: "Full Commission",
    hint: "Earn 100% product commission on every sale",
    accent: "from-emerald-500 to-cyan-500",
  },
  {
    icon: Wallet,
    label: "Withdrawals",
    hint: "Unlimited UPI & bank withdrawals",
    accent: "from-primary to-accent",
  },
  {
    icon: Network,
    label: "Level 2 Income",
    hint: "Bonus from your team's sales",
    accent: "from-violet-500 to-purple-500",
  },
  {
    icon: Gift,
    label: "Bonus Rewards",
    hint: "Monthly performance tier bonuses",
    accent: "from-fuchsia-500 to-rose-500",
  },
];

export function LockedFeatures() {
  return (
    <div className="rounded-3xl bg-card border border-border p-6 shadow-elegant">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div>
          <p className="text-[11px] font-bold text-warning uppercase tracking-widest inline-flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Locked for Free Users
          </p>
          <h2 className="text-xl font-extrabold mt-1">
            Activate to unlock the full earning system
          </h2>
        </div>
        <Link
          to="/products"
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-brand text-primary-foreground font-bold shadow-glow text-sm"
        >
          Activate Now{" "}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          return (
            <div
              key={it.label}
              className="relative rounded-2xl border border-border bg-secondary/40 p-4 overflow-hidden"
            >
              <div
                className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${it.accent} opacity-10 blur-2xl`}
              />
              <div className="relative">
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${it.accent} text-white grid place-items-center shadow-glow opacity-60`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <p className="font-extrabold text-sm">{it.label}</p>
                  <Lock className="w-3 h-3 text-warning" />
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{it.hint}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
