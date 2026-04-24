"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Car, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              scrolled ? "bg-primary" : "bg-white/10 backdrop-blur"
            }`}>
              <Car className={`w-6 h-6 ${scrolled ? "text-white" : "text-accent"}`} />
            </div>
            <div>
              <span className={`font-outfit font-bold text-lg ${
                scrolled ? "text-secondary" : "text-white"
              }`}>
                MOTOLISTING
              </span>
              <span className={`hidden sm:block text-[10px] -mt-1 ${
                scrolled ? "text-text-secondary" : "text-white/60"
              }`}>
                Auto Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className={`text-sm font-medium transition-colors ${
              scrolled ? "text-text-secondary hover:text-primary" : "text-white/80 hover:text-white"
            }`}>
              Home
            </Link>
            <Link href="/listings" className={`text-sm font-medium transition-colors ${
              scrolled ? "text-text-secondary hover:text-primary" : "text-white/80 hover:text-white"
            }`}>
              Browse Cars
            </Link>
            <Link href="/seafood" className={`text-sm font-medium transition-colors ${
              scrolled ? "text-text-secondary hover:text-primary" : "text-white/80 hover:text-white"
            }`}>
              Seafood Shop
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    scrolled
                      ? "bg-primary text-white hover:bg-primary-600"
                      : "bg-white/10 backdrop-blur text-white hover:bg-white/20"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className={`p-2 rounded-lg transition-colors ${
                    scrolled
                      ? "text-text-secondary hover:bg-gray-100"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    scrolled
                      ? "text-text-secondary hover:text-primary"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    scrolled
                      ? "bg-primary text-white hover:bg-primary-600"
                      : "bg-accent text-secondary hover:bg-accent/90"
                  }`}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg ${
              scrolled ? "text-text-secondary" : "text-white"
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200/20 pt-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              <Link href="/" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium text-text-primary hover:bg-gray-100 rounded-lg">Home</Link>
              <Link href="/listings" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium text-text-primary hover:bg-gray-100 rounded-lg">Browse Cars</Link>
              <Link href="/seafood" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium text-text-primary hover:bg-gray-100 rounded-lg">Seafood Shop</Link>
              <hr className="my-2" />
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg text-left flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium text-text-primary hover:bg-gray-100 rounded-lg">Sign In</Link>
                  <Link href="/auth/register" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg text-center">Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
