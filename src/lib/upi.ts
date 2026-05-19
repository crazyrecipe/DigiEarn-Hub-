// UPI payment helpers — per-app merchant accounts
export type UpiApp = "PhonePe" | "Google Pay" | "Paytm";

export const UPI_ACCOUNTS: Record<UpiApp, { pa: string; pn: string }> = {
  PhonePe: { pa: "7486908103-2@ibl", pn: "ronak sanariya" },
  "Google Pay": { pa: "sanariyaronak1@oksbi", pn: "ronak sanariya" },
  Paytm: { pa: "7486908103@ptyes", pn: "sanariya ronak vasantbhai" },
};

// Default merchant UPI ID (used as fallback in QR/manual section)
export const MERCHANT_UPI_ID = UPI_ACCOUNTS["Paytm"].pa;
export const MERCHANT_NAME = UPI_ACCOUNTS["Paytm"].pn;

export function buildUpiUrlForApp(app: UpiApp, amount: number, title: string) {
  const acc = UPI_ACCOUNTS[app];
  const am = Number(amount).toFixed(2);
  return (
    "upi://pay?pa=" +
    encodeURIComponent(acc.pa) +
    "&pn=" +
    encodeURIComponent(acc.pn) +
    "&am=" +
    am +
    "&cu=INR" +
    "&tn=" +
    encodeURIComponent(title)
  );
}
