import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { money } from "@/lib/api";
import { Users, Package, IndianRupee, Wallet, Clock, BadgeCheck } from "lucide-react";
import { StatCard } from "@/components/StatCard";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const { data, products } = useStore();
  const pendingPay = data.payments.filter(
    (p: any) => String(p.status).toLowerCase() === "pending",
  ).length;
  const pendingWd = data.withdrawals.filter(
    (w: any) => String(w.status).toLowerCase() === "pending",
  ).length;
  const totalSales = data.orders.reduce((s, o: any) => s + Number(o.amount || 0), 0);
  const approvedOrders = data.orders.length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total Users"
          value={data.users.length}
          icon={<Users className="w-5 h-5" />}
          accent="from-sky-500 to-indigo-500"
        />
        <StatCard
          label="Active Products"
          value={products.length}
          icon={<Package className="w-5 h-5" />}
          accent="from-primary to-accent"
        />
        <StatCard
          label="Total Sales"
          value={money(totalSales)}
          icon={<IndianRupee className="w-5 h-5" />}
          accent="from-emerald-500 to-cyan-500"
        />
        <StatCard
          label="Approved Orders"
          value={approvedOrders}
          icon={<BadgeCheck className="w-5 h-5" />}
          accent="from-violet-500 to-purple-500"
        />
        <StatCard
          label="Pending Payments"
          value={pendingPay}
          icon={<Clock className="w-5 h-5" />}
          accent="from-amber-500 to-orange-500"
        />
        <StatCard
          label="Pending Withdrawals"
          value={pendingWd}
          icon={<Wallet className="w-5 h-5" />}
          accent="from-rose-500 to-pink-500"
        />
        <StatCard
          label="Total Withdrawals"
          value={data.withdrawals.length}
          icon={<Wallet className="w-5 h-5" />}
          accent="from-fuchsia-500 to-rose-500"
        />
        <StatCard
          label="Total Payments"
          value={data.payments.length}
          icon={<IndianRupee className="w-5 h-5" />}
          accent="from-teal-500 to-emerald-500"
        />
      </div>
    </div>
  );
}
