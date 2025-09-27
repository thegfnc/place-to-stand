"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#how-we-work", label: "How We Work" },
  { href: "#team", label: "Team" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" }
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 24);
    };

    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex justify-center px-4 transition-all",
        scrolled ? "py-3" : "py-6"
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-6xl items-center justify-between rounded-full border border-white/10 px-6 py-3 transition backdrop-blur-md",
          scrolled ? "bg-white/70 shadow-md" : "bg-white/40"
        )}
      >
        <Link href="#home" className="flex items-center gap-3">
          <span className="h-9 w-9 rounded-full bg-gradientPrimary" aria-hidden />
          <span className="font-logo text-xl uppercase tracking-[0.24em] text-ink">
            Place To Stand
          </span>
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/70 transition hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild size="sm" variant="secondary" className="hidden md:inline-flex">
            <Link href="#contact">Start a Project</Link>
          </Button>
          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-controls="mobile-nav"
            aria-expanded={mobileOpen}
          >
            <span className="sr-only">Toggle navigation</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-8 w-8 text-ink"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
      <nav
        id="mobile-nav"
        className={cn(
          "absolute top-full mt-3 flex w-full max-w-6xl flex-col gap-2 rounded-3xl bg-white/95 p-6 text-center shadow-xl transition md:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        {NAV_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full px-6 py-3 text-base font-semibold uppercase tracking-[0.2em] text-ink/80 transition hover:bg-ink hover:text-ink-light"
            onClick={() => setMobileOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
