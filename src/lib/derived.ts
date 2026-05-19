import { useStore, type User } from "./store";
import { isOwnerActivated } from "./owner";

const lower = (v: any) =>
  String(v || "")
    .trim()
    .toLowerCase();
const upper = (v: any) =>
  String(v || "")
    .trim()
    .toUpperCase();
const num = (v: any) => Number(v || 0);

export const ADMIN_EMAILS = ["admin@digiearn.com", "admin@digigrowth.com"];

export function isAdmin(u: User | null) {
  if (!u) return false;
  if (lower((u as any).role) === "admin") return true;
  return ADMIN_EMAILS.includes(lower(u.email));
}

export function isProductActivation(p: any) {
  const v = p?.isActivationProduct ?? p?.activation ?? p?.isActivation ?? p?.type;
  const s = lower(v);
  return v === true || s === "true" || s === "yes" || s === "1" || s === "activation";
}

export function level2Of(p: any) {
  const direct = num(p?.level2Commission ?? p?.l2 ?? p?.level2);
  if (direct > 0) return direct;
  return Math.round(num(p?.commission) * 0.1);
}

export function isFeatured(p: any) {
  return lower(p?.featured) === "true" || p?.featured === true || lower(p?.badge) === "featured";
}
export function isBestseller(p: any) {
  return (
    lower(p?.bestseller) === "true" || p?.bestseller === true || lower(p?.badge) === "bestseller"
  );
}

export function useDerived() {
  const { user, data, products } = useStore();

  const ref = upper(user?.referralCode);
  const directRefs = user ? data.users.filter((u) => upper(u.referredBy) === ref) : [];
  const directCodes = directRefs.map((u) => upper(u.referralCode)).filter(Boolean);
  const level2Refs = directCodes.length
    ? data.users.filter((u) => directCodes.includes(upper(u.referredBy)))
    : [];

  const ids = directRefs.map((u) => String(u.id || ""));
  const emails = directRefs.map((u) => lower(u.email));
  const l2Ids = level2Refs.map((u) => String(u.id || ""));
  const l2Emails = level2Refs.map((u) => lower(u.email));

  const directOrders = data.orders.filter(
    (o: any) => ids.includes(String(o.userId || "")) || emails.includes(lower(o.userEmail)),
  );
  const l2Orders = data.orders.filter(
    (o: any) => l2Ids.includes(String(o.userId || "")) || l2Emails.includes(lower(o.userEmail)),
  );

  const productMap = new Map(products.map((p) => [String(p.id), p]));

  const directEarn = directOrders.reduce((s, o: any) => s + num(o.commission), 0);
  const l2Earn = l2Orders.reduce((s, o: any) => {
    const prod = productMap.get(String(o.productId)) as any;
    return (
      s + (num(o.level2Commission) || (prod ? level2Of(prod) : Math.round(num(o.commission) * 0.1)))
    );
  }, 0);
  const teamEarn = directEarn + l2Earn;

  // Activation: any approved payment by user on an activation product OR any approved order
  const myPayments = user
    ? data.payments.filter(
        (p: any) =>
          String(p.userId) === String(user.id) || lower(p.userEmail) === lower(user.email),
      )
    : [];
  const myOrders = user
    ? data.orders.filter(
        (o: any) =>
          String(o.userId) === String(user.id) || lower(o.userEmail) === lower(user.email),
      )
    : [];

  const hasActivationProduct = products.some(isProductActivation);
  const activationOrder = myOrders.find((o: any) => {
    const prod = productMap.get(String(o.productId));
    return prod ? isProductActivation(prod) : false;
  });
  const ownerActivated = !!user && isOwnerActivated(user.email);
  const isActivated =
    !!user &&
    (ownerActivated ||
      lower((user as any).activated) === "true" ||
      (user as any).activated === true ||
      !!activationOrder ||
      (!hasActivationProduct && myOrders.length > 0));

  // Monthly sales (sum of approved order amounts where this user is seller — i.e. orders by their referrals)
  const now = new Date();
  const sameMonth = (d: any) => {
    const x = new Date(d);
    return x.getMonth() === now.getMonth() && x.getFullYear() === now.getFullYear();
  };
  const monthlySales = directOrders
    .filter((o: any) => sameMonth(o.createdAt))
    .reduce((s, o: any) => s + num(o.amount), 0);

  let bonusPct = 0;
  if (monthlySales >= 20000) bonusPct = 20;
  else if (monthlySales >= 5000) bonusPct = 10;
  const nextTarget = monthlySales >= 20000 ? null : monthlySales >= 5000 ? 20000 : 5000;
  const monthlyBonus = Math.round((monthlySales * bonusPct) / 100);

  // Leaderboard: rank users by monthly sales (their referrals' approved orders)
  const userByCode = new Map(data.users.map((u) => [upper(u.referralCode), u]));
  const monthlyByRef = new Map<string, number>();
  for (const o of data.orders as any[]) {
    if (!sameMonth(o.createdAt)) continue;
    const buyer = data.users.find(
      (u) => String(u.id) === String(o.userId) || lower(u.email) === lower(o.userEmail),
    );
    const code = upper(buyer?.referredBy);
    if (!code) continue;
    monthlyByRef.set(code, (monthlyByRef.get(code) || 0) + num(o.amount));
  }
  const leaderboard = [...monthlyByRef.entries()]
    .map(([code, total]) => ({ user: userByCode.get(code), total }))
    .filter((x) => x.user)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // Month end countdown
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const msLeft = lastDay.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.ceil(msLeft / 86400000));

  // 30-day daily series for sparkline
  const series: { d: string; v: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    const k = day.toDateString();
    const total = directOrders
      .filter((o: any) => new Date(o.createdAt).toDateString() === k)
      .reduce((s, o: any) => s + num(o.amount), 0);
    series.push({ d: k, v: total });
  }

  return {
    directRefs,
    level2Refs,
    directOrders,
    l2Orders,
    directEarn,
    l2Earn,
    teamEarn,
    isActivated,
    ownerActivated,
    hasActivationProduct,
    monthlySales,
    bonusPct,
    monthlyBonus,
    nextTarget,
    leaderboard,
    daysLeft,
    series,
    myPayments,
    myOrders,
  };
}
