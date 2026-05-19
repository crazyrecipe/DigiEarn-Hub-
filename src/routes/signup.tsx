import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { z } from "zod";
import {
  captureOwnerInviteFromUrl,
  getPendingOwnerInvite,
  clearPendingOwnerInvite,
  isValidOwnerInvite,
  markOwnerActivated,
} from "@/lib/owner";

export const Route = createFileRoute("/signup")({
  validateSearch: z.object({ ref: z.string().optional(), ownerInvite: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Sign Up — DigiEarn Hub" },
      { name: "description", content: "Free account banayein aur instant referral code paayein." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { setUser, refresh, user } = useStore();
  const nav = useNavigate();
  const search = useSearch({ from: "/signup" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    referredBy: "",
  });
  const [busy, setBusy] = useState(false);

  const [ownerInvite, setOwnerInvite] = useState<string>("");

  useEffect(() => {
    if (user) nav({ to: "/dashboard" });
  }, [user, nav]);
  useEffect(() => {
    let ref = search.ref;
    if (!ref && typeof window !== "undefined") {
      try {
        ref = localStorage.getItem("deh_referralCode") || undefined;
      } catch {}
    }
    if (ref) {
      const code = ref.toUpperCase();
      setForm((f) => (f.referredBy ? f : { ...f, referredBy: code }));
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("deh_referralCode", code);
        } catch {}
      }
    }
    // Owner Special Invite capture (URL takes priority, then localStorage)
    const oi = (
      search.ownerInvite ||
      captureOwnerInviteFromUrl() ||
      getPendingOwnerInvite() ||
      ""
    ).toUpperCase();
    if (oi) setOwnerInvite(oi);
  }, [search.ref, search.ownerInvite]);

  const update = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    const { name, email, phone, password, referredBy } = form;
    if (!name || !email || !phone || !password) return toast.error("Saari details fill karein");
    setBusy(true);
    const r: any = await api("signup", {
      name,
      email: email.toLowerCase(),
      phone,
      password,
      referredBy: referredBy.toUpperCase(),
      ownerInvite,
    });
    setBusy(false);
    if (r?.success) {
      // Owner Special Invite → auto-activate this user on the client
      if (isValidOwnerInvite(ownerInvite)) {
        markOwnerActivated(r.user.email);
        clearPendingOwnerInvite();
        toast.success("Owner Special Invite applied — account auto-activated ✅");
      }
      setUser(r.user);
      toast.success("Welcome! Your referral code: " + r.user.referralCode);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("deh_referralCode");
        } catch {}
      }
      await refresh();
      nav({ to: "/dashboard" });
    } else toast.error(r?.message || "Signup failed");
  };

  return (
    <PageShell>
      <section className="max-w-md mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-3xl bg-card border border-border p-8 shadow-elegant">
          <h1 className="text-3xl font-extrabold">Create Account</h1>
          <p className="text-muted-foreground mt-1 text-sm">Free signup · Instant referral code</p>
          {form.referredBy && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
              Referred by: {form.referredBy}
            </div>
          )}
          {isValidOwnerInvite(ownerInvite) && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/30 text-xs font-extrabold text-success">
              ✅ Owner Special Invite · Auto-Activation Enabled
            </div>
          )}
          <div className="space-y-3 mt-6">
            <Input placeholder="Full Name" value={form.name} onChange={update("name")} />
            <Input type="email" placeholder="Email" value={form.email} onChange={update("email")} />
            <Input placeholder="Phone" value={form.phone} onChange={update("phone")} />
            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={update("password")}
            />
            <Input
              placeholder="Referral Code (optional)"
              value={form.referredBy}
              onChange={update("referredBy")}
            />
            <Button
              onClick={submit}
              disabled={busy}
              className="w-full bg-gradient-brand shadow-glow"
            >
              {busy ? "Creating…" : "Create Account"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
