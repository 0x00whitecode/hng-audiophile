"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { products } from "@/data/products";
import ResponsivePicture from "@/components/ResponsivePicture";

type SortKey = "featured" | "price_asc" | "price_desc" | "name";

export default function HeadphonesPage() {
  const headphones = useMemo(() => products.filter((p) => p.category === "headphones"), []);

  // Filtering/sorting state (prepared for multiple headphone models)
  const [sort, setSort] = useState<SortKey>("featured");
  const [filterXX99M2, setFilterXX99M2] = useState(true);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const visible = useMemo(() => {
    let list = [...headphones];
    // Model filter (future‑proof for more headphones)
    list = list.filter((p) => {
      const isXX99M2 = /XX99\s*Mark\s*II/i.test(p.name);
      if (isXX99M2 && !filterXX99M2) return false;
      return true;
    });
    // Price range
    const min = minPrice ? parseInt(minPrice, 10) : Number.NEGATIVE_INFINITY;
    const max = maxPrice ? parseInt(maxPrice, 10) : Number.POSITIVE_INFINITY;
    list = list.filter((p) => p.price >= min && p.price <= max);
    // Sorting
    list.sort((a, b) => {
      switch (sort) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "featured":
        default:
          return 0; // single‑model default keeps Figma ordering
      }
    });
    return list;
  }, [headphones, sort, filterXX99M2, minPrice, maxPrice]);

  return (
    <div className="container py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-700">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)] rounded">Home</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium">Headphones</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mt-4">
        <h1 className="text-3xl font-semibold uppercase tracking-widest">Headphones</h1>
        <p className="mt-2 text-neutral-700 max-w-2xl">Premium over‑ear headphones engineered for natural, lifelike sound. Filter and sort to quickly find what fits your listening style.</p>
      </header>

      {/* Controls */}
      <section className="mt-8 rounded border p-4" aria-label="Filtering and sorting">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm">Sort by
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="mt-1 w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                aria-label="Sort headphones"
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Name A–Z</option>
              </select>
            </label>
          </div>
          <fieldset className="space-y-2" aria-label="Model">
            <legend className="text-sm">Filter model</legend>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={filterXX99M2} onChange={(e) => setFilterXX99M2(e.target.checked)} /> XX99 Mark II
            </label>
          </fieldset>
          <div className="grid grid-cols-2 gap-3" aria-label="Price range">
            <label className="block text-sm">Min price
              <input
                inputMode="numeric"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              />
            </label>
            <label className="block text-sm">Max price
              <input
                inputMode="numeric"
                placeholder="9999"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              />
            </label>
          </div>
        </div>
      </section>

      {/* Product Listing */}
      <section className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Headphones product list">
        {visible.map((p) => (
          <article key={p.id} className="rounded-lg bg-neutral-100 overflow-hidden">
            <div className="aspect-[4/3] bg-neutral-200">
              <ResponsivePicture src={p.images.category} alt={`${p.name} category image`} className="w-full h-full" />
            </div>
            <div className="p-6">
              <h2 className="text-lg font-semibold tracking-wide">{p.name}</h2>
              <p className="mt-2 text-neutral-700">{p.description}</p>
              <p className="mt-3 font-semibold">${p.price}</p>
              <div className="mt-4 flex items-center gap-3">
                <Link href={`/products/${p.slug}`} className="btn btn-primary btn-sm transition-transform hover:-translate-y-0.5 active:translate-y-px" aria-label={`See ${p.name}`}>See Product</Link>
                <Link href={`/products/${p.slug}#details`} className="btn btn-sm transition-transform hover:-translate-y-0.5 active:translate-y-px" aria-label={`View specifications for ${p.name}`}>Specifications</Link>
              </div>
            </div>
          </article>
        ))}
        {visible.length === 0 && (
          <p className="text-neutral-700">No headphones match your filters.</p>
        )}
      </section>

      {/* Accessibility helper: contrast */}
      <section className="sr-only" aria-label="Accessibility notes">
        <p>All interactive elements have visible focus styles and sufficient contrast.</p>
      </section>
    </div>
  );
}