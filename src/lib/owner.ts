// Owner Special Invite system — client-side activation override.
// Backend (Google Apps Script) is not modified; we persist owner-activated
// users in localStorage and treat them as activated in derived selectors.

export const OWNER_INVITE_CODE = "RONAKFREE";

const PENDING_KEY = "deh_ownerInvite";
const ACTIVATED_KEY = "deh_ownerActivatedUsers"; // JSON: string[] of lowercased emails

const isBrowser = () => typeof window !== "undefined";

export function captureOwnerInviteFromUrl(): string | null {
  if (!isBrowser()) return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const code = (params.get("ownerInvite") || "").trim().toUpperCase();
    if (code) {
      localStorage.setItem(PENDING_KEY, code);
      return code;
    }
    return localStorage.getItem(PENDING_KEY);
  } catch {
    return null;
  }
}

export function getPendingOwnerInvite(): string | null {
  if (!isBrowser()) return null;
  try {
    return localStorage.getItem(PENDING_KEY);
  } catch {
    return null;
  }
}

export function clearPendingOwnerInvite() {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(PENDING_KEY);
  } catch {}
}

export function isValidOwnerInvite(code?: string | null): boolean {
  return (
    String(code || "")
      .trim()
      .toUpperCase() === OWNER_INVITE_CODE
  );
}

function readList(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(ACTIVATED_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.map((x) => String(x).toLowerCase()) : [];
  } catch {
    return [];
  }
}

function writeList(list: string[]) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(ACTIVATED_KEY, JSON.stringify(Array.from(new Set(list))));
  } catch {}
}

export function markOwnerActivated(email: string) {
  const e = String(email || "")
    .trim()
    .toLowerCase();
  if (!e) return;
  writeList([...readList(), e]);
}

export function isOwnerActivated(email?: string | null): boolean {
  const e = String(email || "")
    .trim()
    .toLowerCase();
  if (!e) return false;
  return readList().includes(e);
}
