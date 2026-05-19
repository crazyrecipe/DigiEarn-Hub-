import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { AuthRequired } from "@/components/AuthRequired";
import { useStore } from "@/lib/store";
import { money, dateTxt, statusClass } from "@/lib/api";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Payment Status — DigiEarn Hub" },
      { name: "description", content: "Apne saare payment requests aur unka status track karein." },
    ],
  }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const { user, data } = useStore();
  if (!user)
    return (
      <PageShell>
        <AuthRequired />
      </PageShell>
    );

  const reqs = data.payments.filter(
    (r: any) =>
      String(r.userId) === String(user.id) ||
      String(r.userEmail || "").toLowerCase() === String(user.email).toLowerCase(),
  );
  const orders = data.orders.filter(
    (o: any) =>
      String(o.userId) === String(user.id) ||
      String(o.userEmail || "").toLowerCase() === String(user.email).toLowerCase(),
  );

  const items =
    reqs.length > 0
      ? reqs
      : orders.map((o: any) => ({ ...o, status: "approved", utr: o.utr || "—" }));

  return (
    <PageShell>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold">Payment Status</h1>
        <p className="text-muted-foreground mt-2">
          Aapke saare submitted UTR aur unka current status.
        </p>

        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-card border border-border p-12 text-center shadow-elegant">
            <p className="text-muted-foreground">No payment request submitted yet.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {items.map((r: any, i: number) => (
              <div
                key={i}
                className="rounded-2xl bg-card border border-border p-5 shadow-elegant flex flex-wrap gap-4 justify-between items-start"
              >
                <div className="space-y-1 min-w-0">
                  <p className="font-extrabold">
                    #{i + 1} · UTR: <span className="font-mono">{r.utr || "N/A"}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Product: {r.productTitle || r.productId || "—"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Amount: <b className="text-foreground">{money(r.amount)}</b> · App:{" "}
                    {r.paymentApp || "UPI"}
                  </p>
                  <p className="text-xs text-muted-foreground">{dateTxt(r.createdAt)}</p>
                </div>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-secondary ${statusClass(r.status)}`}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
