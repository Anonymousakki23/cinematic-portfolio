"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/experience", label: "Experience" },
  { href: "/about", label: "About" },
  { href: "/resume", label: "Resume" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/photography", label: "Photography" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  return pathname === href;
}

export function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#050510]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="font-orbitron text-xl font-bold tracking-wide text-white transition-all hover:text-sci-cyan"
            aria-label="Akshay Iyer — home"
          >
            AI<span className="text-sci-cyan animate-pulse">_</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative py-1 text-sm font-medium transition-colors",
                    active ? "text-sci-cyan" : "text-white/70 hover:text-white"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px bg-sci-cyan transition-all duration-300",
                      active ? "w-full shadow-[0_0_8px_rgba(0,255,255,0.8)]" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              );
            })}
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg border border-white/10 p-2 text-white/70 transition-colors hover:text-sci-cyan md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="border-t border-white/10 bg-[#050510]/95 backdrop-blur-xl md:hidden">
            <div className="space-y-1 px-6 py-4">
              {links.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-sci-cyan/10 text-sci-cyan"
                        : "text-white/70 hover:bg-white/5 hover:text-sci-cyan"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
