import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { AuthRequired } from "@/components/AuthRequired";
import { useStore } from "@/lib/store";
import { api, money, dateTxt, statusClass } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { useDerived } from "@/lib/derived";
import { ActivationBanner } from "@/components/ActivationBanner";
import { BadgeCheck, Wallet, Smartphone, Landmark } from "lucide-react";

const MIN_WITHDRAWAL = 200;

export const Route = createFileRoute("/withdrawals")({
  head: () => ({
    meta: [
      { title: "Withdrawals — DigiEarn Hub" },
      {
        name: "description",
        content: "Activate to unlock unlimited withdrawals. Apni wallet earning withdraw karein.",
      },
    ],
  }),
  component: WithdrawalsPage,
});

type Method = "UPI" | "BANK";

function WithdrawalsPage() {
  const { user, data, refresh } = useStore();
  const nav = useNavigate();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<Method>("UPI");

  // UPI fields
  const [upiId, setUpiId] = useState("");
  const [upiName, setUpiName] = useState("");

  // Bank fields
  const [holder, setHolder] = useState("");
  const [bankName, setBankName] = useState("");
  const [accNo, setAccNo] = useState("");
  const [accNo2, setAccNo2] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [branch, setBranch] = useState("");

  const [busy, setBusy] = useState(false);

  if (!user)
    return (
      <PageShell>
        <AuthRequired />
      </PageShell>
    );

  const { isActivated } = useDerived();

  const list = data.withdrawals.filter(
    (w: any) =>
      String(w.userId) === String(user.id) ||
      String(w.userEmail || "").toLowerCase() === String(user.email).toLowerCase(),
  );

  const reset = () => {
    setAmount("");
    setUpiId("");
    setUpiName("");
    setHolder("");
    setBankName("");
    setAccNo("");
    setAccNo2("");
    setIfsc("");
    setBranch("");
  };

  const submit = async () => {
    if (!isActivated) return toast.error("Pehle apna account activate karein.");
    const n = Number(amount);
    if (!n) return toast.error("Amount fill karein");
    if (n < MIN_WITHDRAWAL) return toast.error(`Minimum withdrawal ${money(MIN_WITHDRAWAL)}`);
    if (n > Number(user.wallet || 0)) return toast.error("Insufficient wallet balance");

    let combined = "";
    if (method === "UPI") {
      const id = upiId.trim();
      const nm = upiName.trim();
      if (!id || !nm) return toast.error("UPI ID aur Name dono fill karein");
      if (!/^[\w.\-]{2,}@[\w.\-]{2,}$/.test(id))
        return toast.error("Valid UPI ID daalein (e.g. name@bank)");
      combined = `UPI: ${id} | Name: ${nm}`;
    } else {
      const ifscUp = ifsc.trim().toUpperCase();
      if (!holder.trim() || !bankName.trim() || !accNo.trim() || !accNo2.trim() || !ifscUp) {
        return toast.error("Sabhi required bank fields fill karein");
      }
      if (accNo !== accNo2) return toast.error("Account number aur Confirm A/C match nahi ho rahe");
      if (!/^\d{6,18}$/.test(accNo.trim())) return toast.error("Valid account number daalein");
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscUp)) return toast.error("Valid IFSC code daalein");
      combined = `BANK | Name: ${holder.trim()} | Bank: ${bankName.trim()} | A/C: ${accNo.trim()} | IFSC: ${ifscUp}${branch.trim() ? ` | Branch: ${branch.trim()}` : ""}`;
    }

    setBusy(true);
    const r: any = await api("addWithdrawal", {
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      amount: n,
      details: combined,
      upi: combined,
    });
    setBusy(false);
    if (r?.success) {
      toast.success("Withdrawal request sent!");
      reset();
      await refresh();
      nav({ to: "/withdrawals" });
    } else toast.error(r?.message || "Failed");
  };

  const detailsOf = (w: any) => String(w?.details || w?.upi || "");
  const methodOf = (s: string): Method =>
    s.trim().toUpperCase().startsWith("BANK") ? "BANK" : "UPI";

  return (
    <PageShell>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="rounded-3xl bg-gradient-hero p-8 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glow" />
          <div className="relative flex justify-between items-center flex-wrap gap-4">
            <div>
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" /> Available Balance
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold mt-1">{money(user.wallet)}</h1>
              <div className="mt-3">
                {isActivated ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success text-success-foreground text-xs font-extrabold">
                    <BadgeCheck className="w-3.5 h-3.5" /> Activated · Unlimited Withdrawals
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning text-warning-foreground text-xs font-extrabold">
                    🔒 Withdrawals Locked
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-white/80 max-w-xs">
              Minimum withdrawal {money(MIN_WITHDRAWAL)}. Approval 24 ghante ke andar.
            </p>
          </div>
        </div>

        {!isActivated && <ActivationBanner />}

        <div
          className={`rounded-3xl bg-card border border-border p-6 shadow-elegant ${!isActivated ? "opacity-60 pointer-events-none" : ""}`}
        >
          <h2 className="text-xl font-extrabold mb-1">Request Withdrawal</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Min. {money(MIN_WITHDRAWAL)} · Apna preferred method choose karein.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              type="button"
              onClick={() => setMethod("UPI")}
              className={`rounded-2xl border-2 p-4 text-left transition-all ${method === "UPI" ? "border-primary bg-primary/5 shadow-glow" : "border-border bg-secondary/30 hover:border-primary/40"}`}
            >
              <Smartphone className="w-5 h-5 mb-2 text-primary" />
              <p className="font-extrabold">UPI</p>
              <p className="text-xs text-muted-foreground">Instant via UPI ID</p>
            </button>
            <button
              type="button"
              onClick={() => setMethod("BANK")}
              className={`rounded-2xl border-2 p-4 text-left transition-all ${method === "BANK" ? "border-primary bg-primary/5 shadow-glow" : "border-border bg-secondary/30 hover:border-primary/40"}`}
            >
              <Landmark className="w-5 h-5 mb-2 text-primary" />
              <p className="font-extrabold">Bank Transfer</p>
              <p className="text-xs text-muted-foreground">NEFT / IMPS to bank A/C</p>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <Label className="mb-1.5 block">Amount (₹)</Label>
              <Input
                type="number"
                placeholder={`Minimum ${MIN_WITHDRAWAL}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {method === "UPI" ? (
              <>
                <div>
                  <Label className="mb-1.5 block">UPI ID *</Label>
                  <Input
                    placeholder="example@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Account Holder Name *</Label>
                  <Input
                    placeholder="Full name as per UPI"
                    value={upiName}
                    onChange={(e) => setUpiName(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label className="mb-1.5 block">Account Holder Name *</Label>
                  <Input
                    placeholder="Full name as per bank"
                    value={holder}
                    onChange={(e) => setHolder(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Bank Name *</Label>
                  <Input
                    placeholder="e.g. SBI, HDFC"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Account Number *</Label>
                  <Input
                    inputMode="numeric"
                    placeholder="Account number"
                    value={accNo}
                    onChange={(e) => setAccNo(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Confirm Account Number *</Label>
                  <Input
                    inputMode="numeric"
                    placeholder="Re-enter account number"
                    value={accNo2}
                    onChange={(e) => setAccNo2(e.target.value.replace(/\D/g, ""))}
                  />
                  {accNo2 && accNo !== accNo2 && (
                    <p className="text-xs text-destructive mt-1">Account numbers do not match</p>
                  )}
                </div>
                <div>
                  <Label className="mb-1.5 block">IFSC Code *</Label>
                  <Input
                    placeholder="e.g. SBIN0000001"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    maxLength={11}
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Branch (optional)</Label>
                  <Input
                    placeholder="Branch name"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          <Button
            onClick={submit}
            disabled={busy || !isActivated}
            className="mt-5 bg-gradient-brand shadow-glow"
          >
            {busy ? "Sending…" : "Request Withdrawal"}
          </Button>
          {!isActivated && (
            <Link
              to="/products"
              className="block text-center mt-3 text-sm font-bold text-primary underline"
            >
              Activate karne ke liye products dekhein →
            </Link>
          )}
        </div>

        <div className="rounded-3xl bg-card border border-border p-6 shadow-elegant">
          <h2 className="text-xl font-extrabold mb-4">Withdrawal History</h2>
          {list.length === 0 ? (
            <p className="text-sm text-muted-foreground">No withdrawal request yet.</p>
          ) : (
            <div className="space-y-3">
              {list.map((w: any, i: number) => {
                const det = detailsOf(w);
                const m = methodOf(det);
                return (
                  <div
                    key={i}
                    className="rounded-2xl bg-secondary/50 p-4 flex flex-wrap gap-3 justify-between items-start"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-extrabold">
                          #{i + 1} · {money(w.amount)}
                        </p>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-wide">
                          {m === "BANK" ? (
                            <Landmark className="w-3 h-3" />
                          ) : (
                            <Smartphone className="w-3 h-3" />
                          )}
                          {m === "BANK" ? "Bank" : "UPI"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground break-words mt-1">{det}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{dateTxt(w.createdAt)}</p>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-extrabold uppercase bg-card ${statusClass(w.status)}`}
                    >
                      {w.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
