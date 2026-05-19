import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — DigiEarn Hub" },
      { name: "description", content: "Apne DigiEarn Hub account me login karein." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { setUser, refresh, user } = useStore();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) nav({ to: "/dashboard" });
  }, [user, nav]);

  const submit = async () => {
    if (!email || !password) return toast.error("Email aur password enter karein");
    setBusy(true);
    const r: any = await api("login", { email: email.toLowerCase(), password });
    setBusy(false);
    if (r?.success) {
      setUser(r.user);
      toast.success("Logged in!");
      await refresh();
      nav({ to: "/dashboard" });
    } else toast.error(r?.message || "Invalid credentials");
  };

  return (
    <PageShell>
      <section className="max-w-md mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-3xl bg-card border border-border p-8 shadow-elegant">
          <h1 className="text-3xl font-extrabold">Welcome Back</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Login karke apna dashboard access karein
          </p>
          <div className="space-y-3 mt-6">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              onClick={submit}
              disabled={busy}
              className="w-full bg-gradient-brand shadow-glow"
            >
              {busy ? "Logging in…" : "Login"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-6 text-center">
            New here?{" "}
            <Link to="/signup" className="font-bold text-primary hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
