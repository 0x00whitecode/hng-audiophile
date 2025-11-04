import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ResponsivePicture from "@/components/ResponsivePicture";

export default function Home() {
  const featured = products.filter((p) => ["zx9", "zx7", "yx1"].includes(p.id));
  const heroProduct = products.find((p) => p.id === "xx99m2");
  return (
    <div>
      {/* Hero */}
      <section className="bg-neutral-900 text-white">
        <div className="container grid md:grid-cols-2 gap-10 py-20 items-center">
          <div>
            <p className="uppercase tracking-widest text-neutral-400 text-sm">New Product</p>
            <h1 className="mt-2 text-4xl md:text-5xl font-semibold">XX99 Mark II Headphones</h1>
            <p className="mt-4 text-neutral-300 max-w-md">
              Experience natural, lifelike sound with superb detail and control.
            </p>
            <Link href="/products/xx99-mark-two-headphones" className="mt-6 btn btn-primary btn-lg" aria-label="See XX99 Mark II Headphones">
              See Product
            </Link>
          </div>
          <div className="flex items-center justify-center md:justify-end">
            {heroProduct && (
              <div className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px]">
                <ResponsivePicture src={heroProduct.images.hero} alt={`${heroProduct.name} hero image`} priority className="w-full h-full" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Category tiles */}
      <section className="container grid md:grid-cols-3 gap-6 py-12">
        {(() => {
          const coverByCategory = {
            headphones: products.find((p) => p.category === "headphones")?.images.category,
            speakers: products.find((p) => p.category === "speakers")?.images.category,
            earphones: products.find((p) => p.category === "earphones")?.images.category,
          } as const;
          return (["headphones", "speakers", "earphones"] as const).map((c) => {
            const label = c.charAt(0).toUpperCase() + c.slice(1);
            const href = `/category/${c}`;
            return (
              <div key={c} className="rounded-lg overflow-hidden bg-neutral-100 text-center">
                <div className="h-44 sm:h-48 bg-neutral-300">
                  {coverByCategory[c] && (
                    <ResponsivePicture src={coverByCategory[c]!} alt={`${label} cover`} className="w-full h-full" />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-semibold uppercase tracking-widest">{label}</h3>
                  <Link href={href} className="mt-3 inline-block text-sm uppercase tracking-widest text-neutral-700 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)]" aria-label={`Shop ${label}`}>
                    Shop ➜
                  </Link>
                </div>
              </div>
            );
          });
        })()}
      </section>

      {/* Featured sections: ZX9, ZX7, YX1 */}
      <section className="container space-y-6 py-10">
        {/* ZX9 large feature */}
        {(() => {
          const zx9 = products.find((p) => p.id === "zx9");
          if (!zx9) return null;
          return (
            <div className="relative overflow-hidden rounded-lg bg-neutral-900 text-white grid md:grid-cols-2 items-center">
              <div className="p-10 md:p-12">
                <h2 className="text-3xl md:text-4xl font-semibold tracking-wide">{zx9.name}</h2>
                <p className="mt-4 text-neutral-300">{zx9.description}</p>
                <Link href={`/products/${zx9.slug}`} className="mt-6 inline-block btn btn-primary" aria-label={`See ${zx9.name}`}>
                  See Product
                </Link>
              </div>
              <div className="aspect-[4/3] bg-neutral-800">
                <ResponsivePicture src={zx9.images.hero} alt={`${zx9.name} hero image`} className="w-full h-full" />
              </div>
            </div>
          );
        })()}

        {/* ZX7 banner feature */}
        {(() => {
          const zx7 = products.find((p) => p.id === "zx7");
          if (!zx7) return null;
          return (
            <div className="relative overflow-hidden rounded-lg bg-neutral-200 grid md:grid-cols-2 items-center">
              <div className="aspect-[4/3] bg-neutral-300">
                <ResponsivePicture src={zx7.images.hero} alt={`${zx7.name} banner image`} className="w-full h-full" />
              </div>
              <div className="p-10 md:p-12">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-wide">{zx7.name}</h2>
                <p className="mt-4 text-neutral-700">{zx7.description}</p>
                <Link href={`/products/${zx7.slug}`} className="mt-6 inline-block btn" aria-label={`See ${zx7.name}`}>
                  See Product
                </Link>
              </div>
            </div>
          );
        })()}

        {/* YX1 card */}
        {(() => {
          const yx1 = products.find((p) => p.id === "yx1");
          if (!yx1) return null;
          return (
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="rounded-lg overflow-hidden aspect-[4/3] bg-neutral-200">
                <ResponsivePicture src={yx1.images.hero} alt={`${yx1.name} image`} className="w-full h-full" />
              </div>
              <div className="rounded-lg overflow-hidden bg-neutral-100 p-10 md:p-12">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-wide">{yx1.name}</h2>
                <p className="mt-4 text-neutral-700">{yx1.description}</p>
                <Link href={`/products/${yx1.slug}`} className="mt-6 inline-block btn" aria-label={`See ${yx1.name}`}>
                  See Product
                </Link>
              </div>
            </div>
          );
        })()}
      </section>
    </div>
  );
}
