"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Search, User, Menu, X, LogIn, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (data.user) setSession(data);
    } catch (error) {}
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/listings?tab=sale", label: "For Sale" },
    { href: "/listings?tab=rent", label: "For Rent" },
    { href: "/listings?tab=installment", label: "Installment" },
    ...(session ? [{ href: "/dashboard", label: "Dashboard" }] : []),
    ...(session?.user?.role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Car className="w-8 h-8 text-accent" />
            <span className="text-white font-outfit font-bold text-xl">Ray Panganiban Tech</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-accent text-secondary"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/listings"
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>
            {session ? (
              <Link
                href="/dashboard"
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="hidden sm:flex items-center gap-1 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
                >
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link
                  href="/auth/register"
                  className="hidden sm:flex items-center gap-1 px-4 py-2 bg-accent text-secondary rounded-lg font-medium text-sm hover:bg-accent/90 transition-colors"
                >
                  <UserPlus className="w-4 h-4" /> Register
                </Link>
              </>
            )}
            <button
              className="md:hidden p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-secondary border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-md text-sm font-medium ${
                  pathname === link.href
                    ? "bg-accent text-secondary"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!session && (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-md text-sm font-medium text-white/80 hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-md text-sm font-medium text-white/80 hover:bg-white/10"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
