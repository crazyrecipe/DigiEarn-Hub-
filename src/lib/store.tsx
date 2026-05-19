import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "./api";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  referralCode: string;
  referredBy?: string;
  wallet?: number;
  totalEarning?: number;
  purchasedProducts?: string;
};

export type Product = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  price: number;
  commission: number;
  image?: string;
  pdfUrl?: string;
  status?: string;
};

type AllData = {
  payments: any[];
  orders: any[];
  withdrawals: any[];
  users: User[];
};

type Ctx = {
  user: User | null;
  products: Product[];
  qr: any;
  announcements: any[];
  data: AllData;
  loading: boolean;
  setUser: (u: User | null) => void;
  refresh: () => Promise<void>;
};

const StoreCtx = createContext<Ctx | null>(null);

const isBrowser = typeof window !== "undefined";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [qr, setQr] = useState<any>({});
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [data, setData] = useState<AllData>({
    payments: [],
    orders: [],
    withdrawals: [],
    users: [],
  });
  const [loading, setLoading] = useState(false);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    if (!isBrowser) return;
    if (u) localStorage.setItem("deh_currentUser", JSON.stringify(u));
    else localStorage.removeItem("deh_currentUser");
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    const r: any = await api("getAll");
    if (r?.success) {
      const prods = (r.products || []).filter((p: Product) => p.status === "active");
      setProducts(prods);
      setQr((r.qrSettings && r.qrSettings[0]) || {});
      const ann = r.announcements || r.notices || [];
      setAnnouncements(ann);
      const all: AllData = {
        payments: r.payments || [],
        orders: r.orders || [],
        withdrawals: r.withdrawals || [],
        users: r.users || [],
      };
      setData(all);
      if (isBrowser) {
        localStorage.setItem(
          "deh_cache_data",
          JSON.stringify({ products: prods, qr: r.qrSettings?.[0] || {}, all, announcements: ann }),
        );
      }
      setUserState((cur) => {
        if (!cur) return cur;
        const fresh = all.users.find(
          (u) =>
            String(u.id || "").trim() === String(cur.id || "").trim() ||
            String(u.email || "")
              .trim()
              .toLowerCase() ===
              String(cur.email || "")
                .trim()
                .toLowerCase(),
        );
        if (fresh) {
          if (isBrowser) localStorage.setItem("deh_currentUser", JSON.stringify(fresh));
          return fresh;
        }
        return cur;
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isBrowser) return;
    try {
      // Capture referral code from URL (?ref=XXXX) and persist it
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref") || params.get("referral") || params.get("referralCode");
      if (ref) {
        localStorage.setItem("deh_referralCode", ref.trim().toUpperCase());
      }
      // Capture Owner Special Invite code (?ownerInvite=XXXX)
      const owner = params.get("ownerInvite");
      if (owner) {
        localStorage.setItem("deh_ownerInvite", owner.trim().toUpperCase());
      }
    } catch {}
    try {
      const u = localStorage.getItem("deh_currentUser");
      if (u) setUserState(JSON.parse(u));
      const c = localStorage.getItem("deh_cache_data");
      if (c) {
        const parsed = JSON.parse(c);
        setProducts(parsed.products || []);
        setQr(parsed.qr || {});
        setAnnouncements(parsed.announcements || []);
        setData(parsed.all || { payments: [], orders: [], withdrawals: [], users: [] });
      }
    } catch {}
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ user, products, qr, announcements, data, loading, setUser, refresh }),
    [user, products, qr, announcements, data, loading, setUser, refresh],
  );
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const v = useContext(StoreCtx);
  if (!v) throw new Error("useStore must be inside StoreProvider");
  return v;
}
