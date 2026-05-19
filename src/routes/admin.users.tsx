import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { api, money, dateTxt } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { BadgeCheck } from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const { data, refresh } = useStore();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return data.users.filter(
      (u: any) =>
        !s ||
        [u.name, u.email, u.referralCode, u.phone].some((v) =>
          String(v || "")
            .toLowerCase()
            .includes(s),
        ),
    );
  }, [data.users, q]);

  const toggleActivate = async (u: any) => {
    setBusy(u.id);
    const r: any = await api("activateUser", {
      userId: u.id,
      activated: !(String(u.activated) === "true"),
    });
    setBusy(null);
    if (r?.success) {
      toast.success("Updated");
      refresh();
    } else toast.error(r?.message || "Action failed");
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name, email, code…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="rounded-3xl bg-card border border-border p-5 shadow-elegant">
        <div className="space-y-2">
          {filtered.map((u: any) => (
            <div
              key={u.id}
              className="rounded-2xl bg-secondary/40 p-4 flex flex-wrap gap-3 justify-between items-start"
            >
              <div className="min-w-0">
                <p className="font-extrabold">
                  {u.name}{" "}
                  <span className="text-xs font-mono text-primary">· {u.referralCode}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {u.email} · {u.phone}
                </p>
                <p className="text-xs text-muted-foreground">
                  Wallet: {money(u.wallet)} · Earned: {money(u.totalEarning)} · Joined{" "}
                  {dateTxt(u.createdAt)}
                </p>
                {u.referredBy && (
                  <p className="text-xs text-muted-foreground">Referred by: {u.referredBy}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {String(u.activated) === "true" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success text-success-foreground text-[10px] font-extrabold uppercase">
                    <BadgeCheck className="w-3 h-3" /> Activated
                  </span>
                )}
                <Button
                  size="sm"
                  disabled={busy === u.id}
                  onClick={() => toggleActivate(u)}
                  variant={String(u.activated) === "true" ? "outline" : "default"}
                >
                  {String(u.activated) === "true" ? "Deactivate" : "Mark Activated"}
                </Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
