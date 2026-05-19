import { Link } from "@tanstack/react-router";
import { Lock, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

export function ActivationBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-br from-warning/60 via-primary/40 to-warning/30 shadow-elegant">
      {/* glow */}
      <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-br from-warning/20 to-primary/10 blur-2xl opacity-70 pointer-events-none" />

      <div className="relative rounded-[22px] overflow-hidden bg-card/80 backdrop-blur-xl border border-border/60 p-6 md:p-8">
        {/* shine sweep */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px]">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[linear-gradient(115deg,transparent_40%,hsl(var(--warning)/0.12)_50%,transparent_60%)] animate-[shine_4s_linear_infinite]" />
        </div>
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-warning/25 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative flex items-start gap-4 flex-wrap">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-2xl bg-warning/40 blur-xl animate-pulse" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-warning/30 to-warning/10 border border-warning/40 grid place-items-center text-warning">
              <Lock className="w-7 h-7" />
            </div>
          </div>

          <div className="flex-1 min-w-[240px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning/15 border border-warning/30 text-warning text-[11px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Withdrawals Locked
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/30 text-success text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" /> Secure
              </span>
            </div>

            <h3
              className={`mt-3 font-extrabold tracking-tight ${compact ? "text-lg" : "text-2xl md:text-3xl"}`}
            >
              Activate your reseller account
            </h3>
            <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
              Purchase any activation product{" "}
              <span className="font-semibold text-foreground">once</span> to unlock{" "}
              <span className="font-semibold text-foreground">unlimited withdrawals forever</span>.
              One‑time setup, lifetime access.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                to="/products"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground font-bold shadow-glow hover:shadow-elegant hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                Activate Now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                100% safe & verified payments
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
