import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { api, money, dateTxt, statusClass } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/payments")({
  component: AdminPayments,
});

function AdminPayments() {
  const { data, refresh } = useStore();
  const [busy, setBusy] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  const list = data.payments.filter((p: any) =>
    filter === "all" ? true : String(p.status || "").toLowerCase() === filter,
  );

  const act = async (id: string, status: "approved" | "rejected") => {
    setBusy(id);
    const r: any = await api("updatePayment", { id, status });
    setBusy(null);
    if (r?.success) {
      toast.success(`Payment ${status}`);
      refresh();
    } else toast.error(r?.message || "Action failed");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
      </div>
      <div className="rounded-3xl bg-card border border-border p-5 shadow-elegant">
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No payments.</p>
        ) : (
          <div className="space-y-2">
            {list.map((p: any, i: number) => (
              <div
                key={p.id || i}
                className="rounded-2xl bg-secondary/40 p-4 flex flex-wrap gap-3 justify-between items-start"
              >
                <div className="min-w-0">
                  <p className="font-extrabold">
                    {p.userName || p.userEmail} · {money(p.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    UTR: <span className="font-mono">{p.utr}</span> · {p.paymentApp}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Product: {p.productTitle || p.productId}
                  </p>
                  <p className="text-xs text-muted-foreground">{dateTxt(p.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-card ${statusClass(p.status)}`}
                  >
                    {p.status}
                  </span>
                  {String(p.status).toLowerCase() === "pending" && (
                    <>
                      <Button
                        size="sm"
                        disabled={busy === p.id}
                        onClick={() => act(p.id, "approved")}
                        className="bg-success text-success-foreground hover:bg-success/90"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        disabled={busy === p.id}
                        onClick={() => act(p.id, "rejected")}
                        variant="destructive"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
