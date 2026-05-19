import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { PageShell } from "@/components/PageShell";
import { useStore, type Product } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { money, fallbackImg } from "@/lib/api";
import { isProductActivation, isFeatured, isBestseller, level2Of } from "@/lib/derived";
import { Star, Flame, Zap, Copy, Facebook, MessageCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ProductBuyDialog } from "@/components/ProductBuyDialog";
import { productReferralLink, whatsappShareUrl, facebookShareUrl } from "@/lib/share";

export const Route = createFileRoute("/product/$productId")({
  validateSearch: z.object({ ref: z.string().optional() }),
  head: ({ params }) => ({
    meta: [
      { title: `${params.productId} — DigiEarn Hub` },
      {
        name: "description",
        content:
          "Premium digital product on DigiEarn Hub. UPI se kharidein aur referral commission paayein.",
      },
    ],
  }),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const search = useSearch({ from: "/product/$productId" });
  const { products, user } = useStore();
  const nav = useNavigate();
  const [selected, setSelected] = useState<Product | null>(null);

  // Persist incoming ref code
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (search.ref) {
      try {
        localStorage.setItem("deh_referralCode", search.ref.trim().toUpperCase());
      } catch {}
    }
  }, [search.ref]);

  const product = products.find(
    (p) => String(p.id).trim().toLowerCase() === String(productId).trim().toLowerCase(),
  );

  const buyNow = () => {
    if (!product) return;
    if (!user) {
      toast.error("Please login first to buy");
      nav({ to: "/signup", search: { ref: search.ref } });
      return;
    }
    setSelected(product);
  };

  const link = product ? productReferralLink(product.id, user?.referralCode) : "";
  const text = product
    ? `${product.title} — ${money(product.price)} only on DigiEarn Hub. Buy now: ${link}`
    : "";

  const copyLink = async () => {
    if (!user) return toast.error("Login to get your referral link");
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Product referral link copied!");
    } catch {
      toast.error("Copy failed");
    }
  };

  if (!product) {
    return (
      <PageShell>
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-2xl font-extrabold">Product not found</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Yeh product available nahi hai ya hata diya gaya hai.
          </p>
          <Button asChild className="mt-6 bg-gradient-brand">
            <Link to="/products">Browse all products</Link>
          </Button>
        </section>
      </PageShell>
    );
  }

  const act = isProductActivation(product);
  const feat = isFeatured(product);
  const best = isBestseller(product);
  const l2 = level2Of(product);

  return (
    <PageShell>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <Link
          to="/products"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> All products
        </Link>

        {search.ref && (
          <div className="rounded-2xl bg-primary/10 border border-primary/20 p-3 text-xs font-bold text-primary text-center">
            🎁 Referred by: <span className="font-mono">{search.ref.toUpperCase()}</span> — signup
            karte hi auto-link ho jayega
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 rounded-3xl bg-card border border-border p-5 shadow-elegant">
          <div className="aspect-[4/3] bg-secondary rounded-2xl overflow-hidden relative">
            <img
              src={product.image || fallbackImg}
              alt={product.title}
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
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-primary uppercase tracking-wide">
              {product.category || "Digital Product"}
            </span>
            <h1 className="text-3xl font-extrabold mt-1">{product.title}</h1>
            <p className="text-xs text-muted-foreground mt-1">ID: {product.id}</p>
            <p className="text-sm text-muted-foreground mt-3">{product.description}</p>

            <div className="mt-5 rounded-2xl bg-secondary/60 p-4">
              <div className="text-3xl font-extrabold text-success">{money(product.price)}</div>
              <div className="text-xs font-bold text-primary mt-1">
                +{money(product.commission)} L1 · +{money(l2)} L2 commission
              </div>
            </div>

            <Button onClick={buyNow} className="mt-4 w-full bg-gradient-brand shadow-glow">
              Buy Now
            </Button>

            <div className="mt-4 rounded-2xl border border-border p-3 space-y-2">
              <p className="text-xs font-bold uppercase text-muted-foreground">
                Share this product
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-[11px] bg-secondary rounded-md px-2 py-1.5 truncate">
                  {link || "Login to get your link"}
                </code>
                <Button size="sm" variant="outline" onClick={copyLink}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    user
                      ? window.open(whatsappShareUrl(text), "_blank")
                      : toast.error("Login first")
                  }
                >
                  <MessageCircle className="w-3 h-3" /> WhatsApp
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    user
                      ? window.open(facebookShareUrl(link), "_blank")
                      : toast.error("Login first")
                  }
                >
                  <Facebook className="w-3 h-3" /> Facebook
                </Button>
              </div>
              {!user && (
                <p className="text-[10px] text-muted-foreground text-center">
                  <Link to="/signup" className="underline font-bold">
                    Sign up
                  </Link>{" "}
                  to get your unique referral link & earn commission
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <ProductBuyDialog product={selected} onClose={() => setSelected(null)} />
    </PageShell>
  );
}
