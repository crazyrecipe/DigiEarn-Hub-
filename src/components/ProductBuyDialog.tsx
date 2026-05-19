import { useState } from "react";
import { useStore, type Product } from "@/lib/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, money, fallbackImg } from "@/lib/api";
import { Copy, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { MERCHANT_UPI_ID, buildUpiUrlForApp, type UpiApp } from "@/lib/upi";
import { useNavigate } from "@tanstack/react-router";

export function ProductBuyDialog({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { user, qr, refresh } = useStore();
  const nav = useNavigate();
  const [step, setStep] = useState<"app" | "utr">("app");
  const [app, setApp] = useState<UpiApp | "">("");
  const [utr, setUtr] = useState("");
  const [payer, setPayer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderId] = useState("DEH" + Date.now().toString().slice(-8));

  const upiId = qr?.upiId || qr?.UPI_ID || MERCHANT_UPI_ID;
  const selected = product;

  const launchApp = (chosen: UpiApp) => {
    if (!selected) return;
    setApp(chosen);
    const upiUrl = buildUpiUrlForApp(chosen, Number(selected.price), selected.title);
    setStep("utr");
    try {
      window.location.href = upiUrl;
    } catch {}
  };

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      toast.success("UPI ID copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const submitPayment = async () => {
    if (!selected || !user) return;
    if (!app) return toast.error("Payment app select karein");
    if (!utr || utr.length < 6) return toast.error("Valid UTR enter karein");
    setSubmitting(true);
    const r: any = await api("addPayment", {
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      productId: selected.id,
      productTitle: selected.title,
      amount: selected.price,
      utr,
      payer,
      paymentApp: app,
      orderId,
    });
    setSubmitting(false);
    if (r?.success) {
      toast.success("Payment request submitted! Admin verification ke baad unlock hoga.");
      onClose();
      await refresh();
      nav({ to: "/payments" });
    } else {
      toast.error(r?.message || "Submit failed");
    }
  };

  return (
    <Dialog open={!!selected} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "app" ? "Choose Payment Method" : `Confirm payment via ${app}`}
          </DialogTitle>
        </DialogHeader>
        {selected && (
          <div className="rounded-2xl bg-secondary p-3 flex gap-3 items-center">
            <img
              src={selected.image || fallbackImg}
              alt={selected.title}
              className="w-16 h-16 rounded-xl object-cover border border-border"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">{selected.title}</p>
              <p className="text-[11px] text-muted-foreground">ID: {selected.id}</p>
              <p className="text-sm">
                <b className="text-success">{money(selected.price)}</b>{" "}
                <span className="text-[11px] text-primary font-bold">
                  +{money(selected.commission)} L1
                </span>
              </p>
            </div>
          </div>
        )}
        {selected && step === "app" && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground text-center">
              Tap your UPI app — amount auto-filled, change nahi kar sakte.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(["PhonePe", "Google Pay", "Paytm"] as UpiApp[]).map((a) => (
                <Button
                  key={a}
                  variant="outline"
                  onClick={() => launchApp(a)}
                  className="h-auto py-3 font-bold flex-col gap-1"
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-xs">{a}</span>
                </Button>
              ))}
            </div>
            <div className="rounded-2xl border border-border p-3 space-y-2">
              <p className="text-xs font-bold uppercase text-muted-foreground">
                Backup: QR / Manual UPI
              </p>
              {qr.qrImage ? (
                <img
                  src={qr.qrImage}
                  alt="UPI QR"
                  className="w-full max-w-[200px] mx-auto rounded-xl border border-border bg-white p-2"
                />
              ) : null}
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-secondary rounded-md px-2 py-1.5 truncate">
                  {upiId}
                </code>
                <Button size="sm" variant="outline" onClick={copyUpi}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Pay <b>{money(selected?.price || 0)}</b> only. Then click below to enter UTR.
              </p>
              <Button size="sm" variant="ghost" className="w-full" onClick={() => setStep("utr")}>
                I have paid — Enter UTR
              </Button>
            </div>
          </div>
        )}
        {selected && step === "utr" && (
          <div className="space-y-3">
            <div className="rounded-2xl bg-warning/10 border border-warning/30 p-3 text-xs space-y-2">
              <p className="font-bold">App nahi khula ya error aaya?</p>
              <p>
                Niche QR scan karein ya UPI ID copy karke <b>{money(selected.price)}</b> exact
                amount pay karein.
              </p>
            </div>
            <div className="rounded-2xl border border-border p-3 space-y-2">
              {qr.qrImage ? (
                <img
                  src={qr.qrImage}
                  alt="UPI QR"
                  className="w-full max-w-[200px] mx-auto rounded-xl border border-border bg-white p-2"
                />
              ) : (
                <div className="text-[11px] text-center text-muted-foreground py-4">
                  QR not configured — use UPI ID below
                </div>
              )}
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-secondary rounded-md px-2 py-1.5 truncate">
                  {upiId}
                </code>
                <Button size="sm" variant="outline" onClick={copyUpi}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              {app && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => launchApp(app as UpiApp)}
                >
                  <Smartphone className="w-3 h-3" /> Retry {app}
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-secondary p-2">
                <div className="text-muted-foreground">Payment App</div>
                <div className="font-bold">{app || "—"}</div>
              </div>
              <div className="rounded-lg bg-secondary p-2">
                <div className="text-muted-foreground">Amount</div>
                <div className="font-bold text-success">{money(selected.price)}</div>
              </div>
              <div className="rounded-lg bg-secondary p-2 col-span-2">
                <div className="text-muted-foreground">Order ID</div>
                <div className="font-bold">{orderId}</div>
              </div>
            </div>
            <Input
              placeholder="UTR / Transaction ID"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
            />
            <Input
              placeholder="Your payer name (optional)"
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
            />
            <Button
              onClick={submitPayment}
              disabled={submitting}
              className="w-full bg-gradient-brand"
            >
              {submitting ? "Submitting…" : "Submit Payment Request"}
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setStep("app")}>
              Change Payment Method
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
