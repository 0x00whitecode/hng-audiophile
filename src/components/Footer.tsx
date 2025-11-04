import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white mt-16">
      <div className="container py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <Link href="/" className="text-xl font-semibold tracking-widest focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded">audiophile</Link>
          <nav className="flex gap-6 text-sm uppercase tracking-widest">
            <Link href="/" className="hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded">Home</Link>
            <Link href="/category/headphones" className="hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded">Headphones</Link>
            <Link href="/category/speakers" className="hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded">Speakers</Link>
            <Link href="/category/earphones" className="hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded">Earphones</Link>
          </nav>
        </div>
        <p className="mt-6 text-neutral-300 max-w-2xl">
          Bringing you the best audio gear. Located at the heart of music culture, we combine performance with timeless design.
        </p>
        <p className="mt-6 text-neutral-400 text-sm">© {new Date().getFullYear()} Audiophile. All rights reserved.</p>
      </div>
    </footer>
  );
}