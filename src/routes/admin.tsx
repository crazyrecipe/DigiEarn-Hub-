import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useStore } from "@/lib/store";
import { isAdmin } from "@/lib/derived";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — DigiEarn Hub" }] }),
  component: AdminLayout,
});

const TABS: { to: string; label: string; exact?: boolean }[] = [
  { to: "/admin", label: "Overview", exact: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/payments", label: "Payments" },
  { to: "/admin/withdrawals", label: "Withdrawals" },
  { to: "/admin/users", label: "Users" },
];

function AdminLayout() {
  const { user } = useStore();
  const loc = useLocation();

  if (!user || !isAdmin(user)) {
    return (
      <PageShell>
        <div className="max-w-md mx-auto py-24 px-4 text-center">
          <Shield className="w-12 h-12 mx-auto text-destructive" />
          <h1 className="text-2xl font-extrabold mt-4">Admin Access Required</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Aapke account me admin permission nahi hai.
          </p>
          <Link
            to="/"
            className="inline-block mt-6 px-5 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground font-bold"
          >
            Go Home
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="rounded-3xl bg-gradient-hero p-6 md:p-8 text-primary-foreground relative overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-glow" />
          <div className="relative flex items-center gap-3">
            <Shield className="w-7 h-7" />
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold">Admin Panel</h1>
              <p className="text-white/70 text-sm">
                Manage products, payments, withdrawals & users.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-6 rounded-2xl bg-card border border-border p-1.5 shadow-elegant overflow-auto">
          {TABS.map((t) => {
            const active = t.exact ? loc.pathname === t.to : loc.pathname.startsWith(t.to);
            return (
              <Link
                key={t.to}
                to={t.to as any}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                  active
                    ? "bg-gradient-brand text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
        <Outlet />
      </section>
    </PageShell>
  );
}
