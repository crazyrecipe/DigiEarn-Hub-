import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { AuthRequired } from "@/components/AuthRequired";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Download, BookOpen } from "lucide-react";

export const Route = createFileRoute("/ebooks")({
  head: () => ({
    meta: [
      { title: "My eBooks — DigiEarn Hub" },
      {
        name: "description",
        content: "Aapke purchased aur unlocked digital products yahan se download karein.",
      },
    ],
  }),
  component: EbooksPage,
});

function EbooksPage() {
  const { user, products, data } = useStore();
  if (!user)
    return (
      <PageShell>
        <AuthRequired />
      </PageShell>
    );

  const userIds = String(user.purchasedProducts || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  const orderIds = data.orders
    .filter(
      (o: any) =>
        String(o.userId) === String(user.id) ||
        String(o.userEmail || "").toLowerCase() === String(user.email).toLowerCase(),
    )
    .map((o: any) => String(o.productId));
  const all = [...new Set([...userIds, ...orderIds])];
  const bought = products.filter((p) => all.includes(String(p.id)));

  return (
    <PageShell>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold">My eBooks</h1>
        <p className="text-muted-foreground mt-2">
          Approved products yahan download ke liye available hain.
        </p>

        {bought.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-card border border-border p-12 text-center shadow-elegant">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground" />
            <h3 className="font-extrabold text-lg mt-3">No products unlocked yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Payment approval ke baad products yahan dikhayi denge.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {bought.map((p) => (
              <div
                key={p.id}
                className="rounded-3xl bg-card border border-border overflow-hidden shadow-elegant hover:shadow-glow transition-shadow flex flex-col"
              >
                <div className="aspect-[16/10] bg-secondary overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-xs font-bold text-success">✓ Unlocked</span>
                  <h3 className="font-extrabold text-lg mt-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex-1">
                    {p.description}
                  </p>
                  <Button
                    asChild
                    className="mt-4 bg-foreground text-background hover:bg-foreground/90"
                  >
                    <a href={p.pdfUrl} target="_blank" rel="noreferrer">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
