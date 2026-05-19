import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShieldCheck,
  Wallet,
  Share2,
  Sparkles,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { money } from "@/lib/api";
import { Announcements } from "@/components/Announcements";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DigiEarn Hub — Premium Digital Products + Referral Income" },
      {
        name: "description",
        content:
          "Learn, buy and share premium digital products. UPI se payment karein, instant download paayein aur referral commission se earn karein.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { products, data, user } = useStore();

  return (
    <PageShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-glow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32 text-primary-foreground">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Digital Products + Referral Income
          </span>
          <h1 className="mt-5 text-5xl md:text-7xl font-extrabold leading-[1.02] max-w-4xl">
            Learn. Buy. Share.{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-cyan-200 bg-clip-text text-transparent">
              Earn.
            </span>
          </h1>
          <p className="mt-5 text-lg text-white/80 max-w-2xl">
            Premium digital products kharidein, UPI QR se payment submit karein, admin approval ke
            baad instant unlock — aur har referral pe lifetime commission paayein.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-white text-foreground hover:bg-white/90 shadow-glow font-bold"
            >
              <Link to={user ? "/dashboard" : "/signup"}>
                {user ? "Go to Dashboard" : "Create Free Account"}{" "}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white font-bold"
            >
              <Link to="/products">Explore Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { l: "Active Products", v: products.length },
            { l: "Approved Orders", v: data.orders.length },
            { l: "Happy Users", v: data.users.length },
            { l: "Total Withdrawals", v: data.withdrawals.length },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl bg-card border border-border p-5 shadow-elegant">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                {s.l}
              </p>
              <h3 className="text-3xl font-extrabold mt-1">{s.v}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <Announcements limit={5} />
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold">Kaise kaam karta hai?</h2>
          <p className="text-muted-foreground mt-3">
            Sirf 3 simple steps me apni earning shuru karein.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              i: BookOpen,
              t: "1. Product Choose Karein",
              d: "Apne interest ke hisab se premium eBooks aur courses select karein.",
            },
            {
              i: ShieldCheck,
              t: "2. UPI QR Pay Karein",
              d: "PhonePe, GPay ya Paytm se QR scan karke payment karein aur UTR submit karein.",
            },
            {
              i: TrendingUp,
              t: "3. Share Karein, Earn Karein",
              d: "Apna referral link share karein aur har sale pe commission wallet me paayein.",
            },
          ].map(({ i: Icon, t, d }) => (
            <div
              key={t}
              className="rounded-3xl bg-gradient-card border border-border p-6 shadow-elegant hover:shadow-glow transition-shadow"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-brand text-primary-foreground grid place-items-center mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold">{t}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold">Featured Products</h2>
            <p className="text-muted-foreground mt-2">
              Top digital products jo abhi sabse zyada bik rahe hain.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/products">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.slice(0, 3).map((p) => (
            <Link
              to="/products"
              key={p.id}
              className="group rounded-3xl bg-card border border-border overflow-hidden shadow-elegant hover:shadow-glow transition-all hover:-translate-y-1"
            >
              <div className="aspect-[16/10] bg-secondary overflow-hidden">
                <img
                  src={
                    p.image ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200"
                  }
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-5">
                <span className="text-xs font-bold text-primary">
                  {p.category || "Digital Product"}
                </span>
                <h3 className="font-extrabold text-lg mt-1 line-clamp-1">{p.title}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-2xl font-extrabold text-success">{money(p.price)}</span>
                  <span className="text-xs font-bold text-primary">
                    +{money(p.commission)} comm.
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {products.length === 0 && (
            <div className="col-span-full p-10 text-center text-muted-foreground rounded-3xl bg-card border border-border">
              Loading products…
            </div>
          )}
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="rounded-3xl bg-gradient-hero p-10 md:p-14 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glow" />
          <div className="relative grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
                Apni earning aaj se shuru karein.
              </h2>
              <p className="text-white/80 mt-3 max-w-lg">
                Free signup, instant referral code, aur transparent payout. Lakhs of users already
                trust DigiEarn Hub.
              </p>
            </div>
            <div className="flex md:justify-end items-end">
              <Button
                asChild
                size="lg"
                className="bg-white text-foreground hover:bg-white/90 shadow-glow font-bold"
              >
                <Link to={user ? "/dashboard" : "/signup"}>
                  {user ? "Open Dashboard" : "Get Started Free"}{" "}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {[
              { i: ShieldCheck, t: "Secure Payments" },
              { i: Wallet, t: "Instant Wallet" },
              { i: Share2, t: "Referral Income" },
              { i: BookOpen, t: "Lifetime Access" },
            ].map(({ i: Icon, t }) => (
              <div key={t} className="flex items-center gap-2 text-sm font-bold">
                <Icon className="w-5 h-5" /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
