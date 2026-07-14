import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Clock,
  HeartPulse,
  LogIn,
  Mail,
  MapPin,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Ratings", href: "/ratings" },
  { label: "About", href: "/about" },
];

export default function HospitalLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_28%),radial-gradient(circle_at_82%_10%,_rgba(16,185,129,0.14),_transparent_24%),linear-gradient(145deg,#020817_0%,#0f172a_44%,#10243a_100%)] font-['Manrope','Plus_Jakarta_Sans',sans-serif] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/15 ring-1 ring-cyan-300/20">
              <HeartPulse className="h-6 w-6 text-cyan-300" />
            </span>
            <span>
              <span className="block text-xs font-bold uppercase tracking-[0.28em] text-cyan-200/80">
                Arogya
              </span>
              <span className="block text-lg font-extrabold leading-5">
                Healthcare
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-4 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white",
                    isActive && "bg-white/10 text-cyan-200"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Button
            asChild
            className="hidden h-11 rounded-full bg-cyan-600 px-5 text-white hover:bg-cyan-700 md:inline-flex"
          >
            <Link to="/login">
              <LogIn className="h-4 w-4" />
              Admin Login
            </Link>
          </Button>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 md:hidden">
            <div className="grid gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "rounded-xl px-4 py-3 text-sm font-bold text-slate-300",
                      isActive && "bg-white/10 text-cyan-200"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Button asChild className="mt-2 h-11 rounded-xl bg-cyan-600 text-white">
                <Link to="/login" onClick={() => setOpen(false)}>
                  <LogIn className="h-4 w-4" />
                  Admin Login
                </Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      <Outlet />

      <footer className="border-t border-white/10 bg-slate-950/85">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/15 ring-1 ring-cyan-300/20">
                  <HeartPulse className="h-6 w-6 text-cyan-300" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200/80">
                    Arogya
                  </p>
                  <p className="text-lg font-extrabold text-white">
                    Healthcare
                  </p>
                </div>
              </div>
              <p className="mt-4 max-w-sm text-sm font-semibold leading-7 text-slate-400">
                Modern hospital care with emergency readiness, specialist OPD,
                diagnostics, and patient support designed for Indian families.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-white">
                Pages
              </h3>
              <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-400">
                {navItems.map((item) => (
                  <Link key={item.href} to={item.href} className="hover:text-cyan-200">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-white">
                Care Units
              </h3>
              <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-400">
                <span>Emergency</span>
                <span>Diagnostics</span>
                <span>Cardiology</span>
                <span>Mother & Child</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-white">
                Contact
              </h3>
              <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-400">
                <span className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-cyan-300" />
                  +91 98765 43210
                </span>
                <span className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-cyan-300" />
                  care@arogyahealth.in
                </span>
                <span className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-cyan-300" />
                  Sector 18, Jaipur, Rajasthan
                </span>
                <span className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 text-cyan-300" />
                  Open 24 hours
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>Copyright 2026 Arogya Healthcare. All rights reserved.</p>
            <p>Emergency care, OPD, diagnostics, and family health support.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
