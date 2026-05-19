import { Link } from "@tanstack/react-router";
import logoFull from "@/assets/logo-full.png";

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <img src={logoFull} alt="DigiEarn Hub" className="h-14 w-auto object-contain" />
          <p className="text-sm text-muted-foreground mt-3 max-w-md">
            Premium digital products khareedo, UPI se payment karo, aur referral commission se earn
            karo — sab ek hi platform pe.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-sm mb-3">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/products" className="hover:text-foreground">
                Products
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/ebooks" className="hover:text-foreground">
                My eBooks
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-sm mb-3">Account</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/signup" className="hover:text-foreground">
                Create Account
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-foreground">
                Login
              </Link>
            </li>
            <li>
              <Link to="/withdrawals" className="hover:text-foreground">
                Withdrawals
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} DigiEarn Hub. All rights reserved.
      </div>
    </footer>
  );
}
