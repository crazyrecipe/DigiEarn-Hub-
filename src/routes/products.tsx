import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useStore, type Product } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { money, fallbackImg } from "@/lib/api";
import { isProductActivation, isFeatured, isBestseller, level2Of, useDerived } from "@/lib/derived";
import {
  Star,
  Flame,
  Zap,
  Copy,
  Share2,
  Facebook,
  MessageCircle,
  Lock,
  BadgeCheck,
  Download,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { ProductBuyDialog } from "@/components/ProductBuyDialog";
import { productReferralLink, whatsappShareUrl, facebookShareUrl } from "@/lib/share";

function usePurchasedIds() {
  const { user, data } = useStore();
  if (!user) return new Set<string>();
  const ids = String(user.purchasedProducts || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  const orderIds = (data?.orders || [])
    .filter(
      (o: any) =>
        String(o.userId) === String(user.id) ||
        String(o.userEmail || "").toLowerCase() === String(user.email || "").toLowerCase(),
    )
    .filter(
      (o: any) =>
        !o.status ||
        String(o.status).toLowerCase() === "approved" ||
        String(o.status).toLowerCase() === "success" ||
        String(o.status).toLowerCase() === "completed",
    )
    .map((o: any) => String(o.productId));
  return new Set<string>(
    [...ids, ...orderIds].map((x) => String(x).trim().toLowerCase()).filter(Boolean),
  );
}

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — DigiEarn Hub" },
      {
        name: "description",
        content:
          "Premium digital products: eBooks, courses aur tools. UPI se kharidein aur referral commission paayein.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { products, user } = useStore();
  const { isActivated } = useDerived();
  const nav = useNavigate();
  const [selected, setSelected] = useState<Product | null>(null);
  const purchased = usePurchasedIds();
  const isPurchased = (p: Product) => purchased.has(String(p.id).trim().toLowerCase());

  const open = (p: Product) => {
    if (!user) {
      toast.error("Please login first");
      nav({ to: "/signup" });
      return;
    }
    setSelected(p);
  };

  const shareLink = (p: Product) => productReferralLink(p.id, user?.referralCode);
  const shareText = (p: Product) =>
    `${p.title} — ${money(p.price)} only on DigiEarn Hub. Buy now: ${shareLink(p)}`;

  const gateShare = (): boolean => {
    if (!user) {
      toast.error("Login to unlock reseller tools");
      return false;
    }
    if (!isActivated) {
      toast.error("Activate reseller account to unlock selling & referral links.");
      return false;
    }
    return true;
  };

  const copyLink = async (p: Product) => {
    if (!gateShare()) return;
    try {
      await navigator.clipboard.writeText(shareLink(p));
      toast.success("Product referral link copied!");
    } catch {
      toast.error("Copy failed");
    }
  };
  const shareWhatsApp = (p: Product) => {
    if (!gateShare()) return;
    window.open(whatsappShareUrl(shareText(p)), "_blank");
  };
  const shareFacebook = (p: Product) => {
    if (!gateShare()) return;
    window.open(facebookShareUrl(shareLink(p)), "_blank");
  };

  return (
    <PageShell>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-3xl bg-gradient-hero p-8 md:p-12 text-primary-foreground relative overflow-hidden mb-10">
          <div className="absolute inset-0 bg-gradient-glow" />
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-extrabold">Digital Products</h1>
            <p className="text-white/80 mt-3 max-w-xl">
              Canva templates, graphic bundles, kids learning packs aur affiliate ebooks — UPI se
              pay karein, instant access paayein.
            </p>
            {user && (
              <div className="mt-4">
                {isActivated ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success text-success-foreground text-xs font-extrabold">
                    <BadgeCheck className="w-3.5 h-3.5" /> Activated · Full commissions unlocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning text-warning-foreground text-xs font-extrabold">
                    <Lock className="w-3.5 h-3.5" /> Free Account · Limited preview commission
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => {
            const act = isProductActivation(p);
            const feat = isFeatured(p);
            const best = isBestseller(p);
            const l2 = level2Of(p);
            return (
              <article
                key={p.id}
                className="rounded-3xl bg-card border border-border overflow-hidden shadow-elegant hover:shadow-glow hover:-translate-y-0.5 transition-all flex flex-col"
              >
                <Link
                  to="/product/$productId"
                  params={{ productId: p.id }}
                  className="aspect-[16/10] bg-secondary overflow-hidden relative block"
                >
                  <img
                    src={p.image || fallbackImg}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {act && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-warning text-warning-foreground text-[10px] font-extrabold uppercase shadow-md">
                        <Zap className="w-3 h-3" />
                        Activation
                      </span>
                    )}
                    {feat && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-extrabold uppercase shadow-md">
                        <Star className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                    {best && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-extrabold uppercase shadow-md">
                        <Flame className="w-3 h-3" />
                        Bestseller
                      </span>
                    )}
                  </div>
                </Link>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-xs font-bold text-primary uppercase tracking-wide">
                    {p.category || "Digital Product"}
                  </span>
                  <Link
                    to="/product/$productId"
                    params={{ productId: p.id }}
                    className="hover:underline"
                  >
                    <h3 className="font-extrabold text-lg mt-1.5">{p.title}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2 flex-1">
                    {p.description}
                  </p>
                  {isActivated ? (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/30 text-success text-[10px] font-extrabold uppercase tracking-wide self-start">
                      <BadgeCheck className="w-3 h-3" /> Full Commissions Unlocked
                    </div>
                  ) : !act ? (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning/10 border border-warning/30 text-warning text-[10px] font-extrabold uppercase tracking-wide self-start">
                      <Lock className="w-3 h-3" />{" "}
                      {user
                        ? "Activation required for full earnings"
                        : "Login to unlock reseller tools"}
                    </div>
                  ) : null}
                  <div className="mt-3 rounded-2xl bg-secondary/60 p-4 flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <div className="text-2xl font-extrabold text-success">{money(p.price)}</div>
                      {isActivated || act ? (
                        <div className="text-xs font-bold text-primary">
                          +{money(p.commission)} L1 · +{money(l2)} L2
                        </div>
                      ) : (
                        <div className="text-xs font-bold text-muted-foreground">
                          Preview: +₹20 ·{" "}
                          <span className="text-primary">
                            Activate for +{money(p.commission)} L1 · +{money(l2)} L2
                          </span>
                        </div>
                      )}
                    </div>
                    {isPurchased(p) ? (
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success text-success-foreground text-[10px] font-extrabold uppercase shadow-md">
                          <CheckCircle2 className="w-3 h-3" /> Purchased
                        </span>
                        {p.pdfUrl && (
                          <Button
                            asChild
                            size="sm"
                            className="bg-success text-success-foreground hover:bg-success/90 shadow-glow"
                          >
                            <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="w-3 h-3" /> Download
                            </a>
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Button onClick={() => open(p)} className="bg-gradient-brand shadow-glow">
                        Buy Now
                      </Button>
                    )}
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyLink(p)}
                      disabled={!isActivated}
                      title={isActivated ? "Copy referral link" : "Activate to unlock"}
                      className="text-xs"
                    >
                      {isActivated ? <Copy className="w-3 h-3" /> : <Lock className="w-3 h-3" />}{" "}
                      Link
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => shareWhatsApp(p)}
                      disabled={!isActivated}
                      title={isActivated ? "Share on WhatsApp" : "Activate to unlock"}
                      className="text-xs"
                    >
                      {isActivated ? (
                        <MessageCircle className="w-3 h-3" />
                      ) : (
                        <Lock className="w-3 h-3" />
                      )}{" "}
                      WA
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => shareFacebook(p)}
                      disabled={!isActivated}
                      title={isActivated ? "Share on Facebook" : "Activate to unlock"}
                      className="text-xs"
                    >
                      {isActivated ? (
                        <Facebook className="w-3 h-3" />
                      ) : (
                        <Lock className="w-3 h-3" />
                      )}{" "}
                      FB
                    </Button>
                  </div>
                  {user && isActivated && (
                    <p className="mt-2 text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1">
                      <Share2 className="w-3 h-3" /> Your code{" "}
                      <b className="font-mono">{user.referralCode}</b> auto-attached
                    </p>
                  )}
                  {user && !isActivated && (
                    <p className="mt-2 text-[10px] text-warning text-center flex items-center justify-center gap-1 font-bold">
                      <Lock className="w-3 h-3" /> Activate reseller account to unlock selling &
                      earnings.
                    </p>
                  )}
                </div>
              </article>
            );
          })}
          {products.length === 0 && (
            <div className="col-span-full p-12 text-center text-muted-foreground rounded-3xl bg-card border border-border">
              No products available yet.
            </div>
          )}
        </div>
      </section>

      <ProductBuyDialog product={selected} onClose={() => setSelected(null)} />

      {!user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          <div className="rounded-2xl bg-warning/10 border border-warning/30 p-4 text-sm text-center">
            Buy karne ke liye{" "}
            <Link to="/signup" className="font-bold underline">
              free account
            </Link>{" "}
            banayein ya{" "}
            <Link to="/login" className="font-bold underline">
              login
            </Link>{" "}
            karein.
          </div>
        </div>
      )}
    </PageShell>
  );
}
