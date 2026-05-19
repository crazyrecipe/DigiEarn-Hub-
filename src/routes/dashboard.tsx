import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { AuthRequired } from "@/components/AuthRequired";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { money, dateTxt, statusClass } from "@/lib/api";
import {
  Copy,
  MessageCircle,
  Wallet,
  TrendingUp,
  Users,
  Network,
  BadgeCheck,
  Clock,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { useDerived } from "@/lib/derived";
import { ActivationBanner } from "@/components/ActivationBanner";
import { LockedFeatures } from "@/components/LockedFeatures";
import { StatCard } from "@/components/StatCard";
import { BonusProgress } from "@/components/BonusProgress";
import { SalesChart } from "@/components/SalesChart";
import { Leaderboard } from "@/components/Leaderboard";
import { Announcements } from "@/components/Announcements";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — DigiEarn Hub" },
      {
        name: "description",
        content: "Wallet, team earnings, monthly bonus aur referral analytics ek jagah.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, data } = useStore();
  if (!user)
    return (
      <PageShell>
        <AuthRequired />
      </PageShell>
    );

  const d = useDerived();

  const link =
    typeof window !== "undefined" ? `${window.location.origin}/?ref=${user.referralCode}` : "";
  const copy = async () => {
    await navigator.clipboard.writeText(link);
    toast.success("Referral link copied!");
  };

  const recentPay = d.myPayments.slice(-3).reverse();
  const recentWd = data.withdrawals
    .filter(
      (w: any) =>
        String(w.userId) === String(user.id) ||
        String(w.userEmail || "").toLowerCase() === String(user.email).toLowerCase(),
    )
    .slice(-3)
    .reverse();

  return (
    <PageShell>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10 space-y-8">
        {/* Greeting */}
        <div className="rounded-3xl bg-gradient-hero p-6 md:p-10 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glow" />
          <div className="relative flex flex-wrap justify-between items-start gap-4">
            <div>
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest">
                Welcome back
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold mt-1">Hi, {user.name} 👋</h1>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-bold">
                  Code: <span className="font-mono">{user.referralCode}</span>
                </span>
                {d.isActivated ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success text-success-foreground text-xs font-extrabold">
                    <BadgeCheck className="w-3.5 h-3.5" />{" "}
                    {d.ownerActivated ? "Owner Activated" : "Activated Reseller"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning text-warning-foreground text-xs font-extrabold">
                    <Clock className="w-3.5 h-3.5" /> Free User · Activation Pending
                  </span>
                )}
                {d.bonusPct > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-extrabold">
                    <TrendingUp className="w-3.5 h-3.5" /> {d.bonusPct}% Bonus Tier
                  </span>
                )}
              </div>
            </div>
            <Button asChild className="bg-white text-foreground hover:bg-white/90 font-bold">
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        </div>

        <Announcements />
        {!d.isActivated && <ActivationBanner />}
        {!d.isActivated && <LockedFeatures />}

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard
            label="Wallet Balance"
            value={money(user.wallet)}
            icon={<Wallet className="w-5 h-5" />}
            accent="from-primary to-accent"
          />
          <StatCard
            label="Total Earnings"
            value={money(user.totalEarning)}
            icon={<TrendingUp className="w-5 h-5" />}
            accent="from-emerald-500 to-cyan-500"
          />
          <StatCard
            label="Pending Earnings"
            value={money(
              d.myPayments
                .filter((p: any) => String(p.status).toLowerCase() === "pending")
                .reduce((s: number, p: any) => s + Number(p.amount || 0), 0),
            )}
            icon={<Clock className="w-5 h-5" />}
            accent="from-amber-500 to-orange-500"
          />
          <StatCard
            label="Monthly Bonus"
            value={money(d.monthlyBonus)}
            hint={d.bonusPct ? `${d.bonusPct}% tier active` : "No tier yet"}
            icon={<TrendingUp className="w-5 h-5" />}
            accent="from-fuchsia-500 to-rose-500"
          />
          <StatCard
            label="Direct Referrals"
            value={d.directRefs.length}
            icon={<Users className="w-5 h-5" />}
            accent="from-sky-500 to-indigo-500"
          />
          <StatCard
            label="Level 2 Referrals"
            value={d.level2Refs.length}
            icon={<Network className="w-5 h-5" />}
            accent="from-violet-500 to-purple-500"
          />
          <StatCard
            label="Team Earnings"
            value={money(d.teamEarn)}
            hint={`L1 ${money(d.directEarn)} · L2 ${money(d.l2Earn)}`}
            icon={<TrendingUp className="w-5 h-5" />}
            accent="from-teal-500 to-emerald-500"
          />
          <StatCard
            label="Withdrawals"
            value={recentWd.length || 0}
            icon={<Wallet className="w-5 h-5" />}
            accent="from-rose-500 to-pink-500"
          />
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <SalesChart series={d.series} />
            <BonusProgress
              monthlySales={d.monthlySales}
              bonusPct={d.bonusPct}
              daysLeft={d.daysLeft}
            />
          </div>
          <Leaderboard rows={d.leaderboard} currentEmail={user.email} />
        </div>

        {/* Referral */}
        <div className="rounded-3xl bg-card border border-border p-6 shadow-elegant">
          <div className="flex items-center gap-2 mb-2">
            <Share2 className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-extrabold">Your Referral Link</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Is link se signup hone wale users pe lifetime commission milega — direct sale + Level 2
            bonus.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Input readOnly value={link} className="flex-1 min-w-[240px] font-mono text-sm" />
            <Button onClick={copy} className="bg-gradient-brand">
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            <Button asChild variant="outline">
              <a
                href={`https://wa.me/?text=${encodeURIComponent("Join DigiEarn Hub: " + link)}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                WhatsApp
              </a>
            </Button>
          </div>
        </div>

        {/* Referral tree */}
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="rounded-3xl bg-card border border-border p-6 shadow-elegant">
            <h2 className="text-lg font-extrabold mb-4">
              Direct Referrals · {d.directRefs.length}
            </h2>
            {d.directRefs.length === 0 ? (
              <p className="text-sm text-muted-foreground">Abhi koi direct referral nahi.</p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-auto pr-1">
                {d.directRefs.map((u, i) => (
                  <div
                    key={u.id || i}
                    className="rounded-2xl bg-secondary/50 p-3 flex justify-between items-center gap-2"
                  >
                    <div className="min-w-0">
                      <p className="font-bold truncate">{u.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <span className="text-xs font-mono text-primary">{u.referralCode}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-3xl bg-card border border-border p-6 shadow-elegant">
            <h2 className="text-lg font-extrabold mb-4">Level 2 Network · {d.level2Refs.length}</h2>
            {d.level2Refs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aapke direct referrals ne abhi tak kisi ko refer nahi kiya.
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-auto pr-1">
                {d.level2Refs.map((u, i) => (
                  <div
                    key={u.id || i}
                    className="rounded-2xl bg-secondary/50 p-3 flex justify-between items-center gap-2"
                  >
                    <div className="min-w-0">
                      <p className="font-bold truncate">{u.name}</p>
                      <p className="text-xs text-muted-foreground truncate">via {u.referredBy}</p>
                    </div>
                    <span className="text-xs font-mono text-accent">L2</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent activity */}
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="rounded-3xl bg-card border border-border p-6 shadow-elegant">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-extrabold">Recent Payments</h2>
              <Link to="/payments" className="text-xs font-bold text-primary">
                View all
              </Link>
            </div>
            {recentPay.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payments yet.</p>
            ) : (
              recentPay.map((p: any, i: number) => (
                <div
                  key={i}
                  className="py-2.5 border-b last:border-0 border-border flex justify-between items-center gap-2"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{p.productTitle || p.productId}</p>
                    <p className="text-xs text-muted-foreground">{dateTxt(p.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-sm">{money(p.amount)}</p>
                    <p className={`text-[10px] font-extrabold uppercase ${statusClass(p.status)}`}>
                      {p.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="rounded-3xl bg-card border border-border p-6 shadow-elegant">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-extrabold">Recent Withdrawals</h2>
              <Link to="/withdrawals" className="text-xs font-bold text-primary">
                View all
              </Link>
            </div>
            {recentWd.length === 0 ? (
              <p className="text-sm text-muted-foreground">No withdrawals yet.</p>
            ) : (
              recentWd.map((w: any, i: number) => (
                <div
                  key={i}
                  className="py-2.5 border-b last:border-0 border-border flex justify-between items-center gap-2"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{w.upi}</p>
                    <p className="text-xs text-muted-foreground">{dateTxt(w.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-sm">{money(w.amount)}</p>
                    <p className={`text-[10px] font-extrabold uppercase ${statusClass(w.status)}`}>
                      {w.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
