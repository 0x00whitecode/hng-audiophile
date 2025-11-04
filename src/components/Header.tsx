"use client";
import Link from "next/link";
import { useCart } from "@/context/cart";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { products } from "@/data/products";
import ResponsivePicture from "./ResponsivePicture";

export default function Header() {
  const { items } = useCart();
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  return (
    <header className="bg-neutral-900 text-white">
      <div className="container flex items-center justify-between py-6">
        <Link href="/" className="text-xl font-semibold tracking-widest focus-visible:ring-2 focus-visible:ring-[var(--primary)]">
          audiophile
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex gap-8 text-sm uppercase tracking-widest" aria-label="Primary" id="primary-navigation">
          {[
            { href: "/", label: "Home" },
            { href: "/category/headphones", label: "Headphones" },
            { href: "/category/speakers", label: "Speakers" },
            { href: "/category/earphones", label: "Earphones" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className="hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile/Tablet menu button */}
        <button
          type="button"
          className="lg:hidden inline-flex items-center gap-2 px-3 py-2 rounded hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          aria-controls="mobile-menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="white" strokeWidth="2" />
          </svg>
        </button>

        {/* Cart link */}
        <Link href="/checkout" className="relative ml-4 focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded">
          <span className="sr-only">Cart</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6h15l-1.5 9h-12z" stroke="white" />
          </svg>
          {count > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-primary text-white rounded-full px-2 py-0.5">
              {count}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile/Tablet overlay navigation */}
      {menuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          className="lg:hidden fixed inset-0 z-40 bg-neutral-900/95 backdrop-blur-sm"
        >
          <div className="container pt-24 pb-10">
            {/* Category tiles for quick navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {(() => {
                const coverByCategory = {
                  headphones: products.find((p) => p.category === "headphones")?.images.category,
                  // Replace speakers tile with Headphones and 1.png image
                  speakers: { desktop: "/images/1.png", tablet: "/images/1.png", mobile: "/images/1.png" },
                  earphones: products.find((p) => p.category === "earphones")?.images.category,
                } as const;
                return (["headphones", "speakers", "earphones"] as const).map((c) => {
                  const label = c === "speakers" ? "Headphones" : c;
                  const href = c === "speakers" ? "/category/headphones" : `/category/${c}`;
                  return (
                    <div key={c} className="rounded-lg overflow-hidden bg-neutral-100 text-center">
                      <div className="h-36 bg-neutral-300">
                        {coverByCategory[c] && (
                          <ResponsivePicture src={coverByCategory[c]!} alt={`${label} cover`} className="w-full h-full" />
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold uppercase tracking-widest text-neutral-900">{label}</h3>
                        <Link
                          href={href}
                          className="mt-3 inline-block text-sm uppercase tracking-widest text-neutral-700 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
                          onClick={() => setMenuOpen(false)}
                        >
                          Shop ➜
                        </Link>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Close button */}
            <div className="mt-8 text-center">
              <button
                type="button"
                className="btn"
                onClick={() => setMenuOpen(false)}
              >
                Close Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}