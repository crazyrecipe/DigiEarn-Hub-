import { Link, useNavigate } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, Shield, BadgeCheck, Lock } from "lucide-react";
import { useState } from "react";
import { isAdmin } from "@/lib/derived";
import { useDerived } from "@/lib/derived";
import logo from "@/assets/logo.png";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/ebooks", label: "My eBooks" },
  { to: "/payments", label: "Payments" },
  { to: "/withdrawals", label: "Withdrawals" },
] as const;

export function SiteHeader() {
  const { user, setUser } = useStore();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const { isActivated } = useDerived();

  const logout = () => {
    setUser(null);
    nav({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/70 supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        <Link
          to="/"
          className="group flex items-center gap-2 font-extrabold text-[15px] xs:text-base sm:text-lg min-w-0 transition-transform duration-200 active:scale-95 hover:scale-[1.02]"
        >
          <span className="relative shrink-0 grid place-items-center w-11 h-11">
            <span
              aria-hidden
              className="absolute -inset-1 rounded-full bg-gradient-brand blur-lg opacity-60 animate-pulse"
            />
            <img
              src={logo}
              alt="DigiEarn Hub logo"
              width={44}
              height={44}
              className="relative w-11 h-11 rounded-full object-contain bg-white ring-2 ring-border/70 shadow-md p-0.5"
            />
          </span>
          <span className="whitespace-nowrap tracking-tight text-foreground leading-none flex items-baseline gap-1">
            <span>DigiEarn</span>
            <span
              className="font-extrabold bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              Hub
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 text-sm font-semibold text-muted-foreground rounded-lg hover:bg-secondary hover:text-foreground transition-colors"
              activeProps={{
                className:
                  "px-3 py-2 text-sm font-semibold rounded-lg bg-secondary text-foreground",
              }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <>
              {isAdmin(user) && (
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin">
                    <Shield className="w-4 h-4 mr-1" />
                    Admin
                  </Link>
                </Button>
              )}
              <span className="text-sm text-muted-foreground">
                Hi, <b className="text-foreground">{user.name?.split(" ")[0]}</b>
              </span>
              {isActivated ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/15 border border-success/30 text-success text-[10px] font-extrabold uppercase tracking-wide">
                  <BadgeCheck className="w-3 h-3" /> Activated
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/15 border border-warning/30 text-warning text-[10px] font-extrabold uppercase tracking-wide">
                  <Lock className="w-3 h-3" /> Free
                </span>
              )}
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="bg-gradient-brand shadow-glow">
                <Link to="/signup">Start Free</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="lg:hidden p-2.5 rounded-xl hover:bg-secondary border border-border/50 shrink-0 grid place-items-center"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="px-4 py-3 flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            {user ? (
              <Button
                variant="ghost"
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link to="/login" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild className="bg-gradient-brand">
                  <Link to="/signup" onClick={() => setOpen(false)}>
                    Start Free
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
