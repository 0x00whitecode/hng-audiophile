import { getProductBySlug } from "@/data/products";
import AddToCart from "@/components/AddToCart";
import ResponsivePicture from "@/components/ResponsivePicture";
import ImageZoom from "@/components/ImageZoom";
import { notFound } from "next/navigation";
import { products as allProducts } from "@/data/products";
import Link from "next/link";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) return notFound();
  const others = ["xx99m2", "zx9", "yx1"].filter((id) => id !== product.id);
  const related = allProducts.filter((p) => others.includes(p.id)).slice(0, 3);

  return (
    <div className="container py-10">
      {/* Primary layout */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div className="aspect-[4/3] bg-neutral-200 rounded overflow-hidden">
          {product.category === "headphones" ? (
            <ImageZoom src={product.images.hero} alt={`${product.name} product hero image`} className="w-full h-full" priority />
          ) : (
            <ResponsivePicture src={product.images.hero} alt={`${product.name} product hero image`} className="w-full h-full" />
          )}
        </div>
        <div>
          <p className="uppercase tracking-widest text-primary text-sm">New Product</p>
          <h1 className="mt-2 text-3xl font-semibold">{product.name}</h1>
          <p className="mt-4 text-neutral-700">{product.description}</p>
          <p className="mt-6 font-semibold">${product.price}</p>
          <AddToCart id={product.id} name={product.name} price={product.price} />
        </div>
      </section>

      {/* Features + In the box */}
      <section className="grid md:grid-cols-2 gap-10 mt-16">
        <article>
          <h2 className="text-xl font-semibold tracking-widest">Features</h2>
          <p className="mt-4 text-neutral-700">
            Carefully crafted to deliver exceptional clarity and control. Designed to complement modern interiors and enhance everyday listening.
          </p>
        </article>
        <aside aria-labelledby="in-the-box">
          <h2 id="in-the-box" className="text-xl font-semibold tracking-widest">In the box</h2>
          <ul className="mt-4 space-y-2 text-neutral-700">
            <li><strong className="text-primary">x1</strong> User manual</li>
            <li><strong className="text-primary">x1</strong> Warranty card</li>
            <li><strong className="text-primary">x1</strong> Premium cable</li>
            <li><strong className="text-primary">x1</strong> Travel pouch</li>
          </ul>
        </aside>
      </section>

      {/* Technical Specifications & Highlights */}
      {product.category === "headphones" && (
        <section className="mt-16 grid md:grid-cols-3 gap-10" aria-label="Specifications and highlights">
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold tracking-widest">Specifications</h2>
            <dl className="mt-4 space-y-2 text-neutral-700">
              <div className="flex justify-between"><dt>Driver</dt><dd>40mm dynamic</dd></div>
              <div className="flex justify-between"><dt>Impedance</dt><dd>32Ω</dd></div>
              <div className="flex justify-between"><dt>Frequency response</dt><dd>15Hz – 28kHz</dd></div>
              <div className="flex justify-between"><dt>Sensitivity</dt><dd>102dB</dd></div>
              <div className="flex justify-between"><dt>Connector</dt><dd>3.5mm stereo</dd></div>
              <div className="flex justify-between"><dt>Cable</dt><dd>1.2m braided</dd></div>
            </dl>
          </div>
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold tracking-widest">Highlights</h2>
            <ul className="mt-4 space-y-2 text-neutral-700">
              <li>Premium build with lightweight comfort for extended sessions</li>
              <li>Balanced sound with detailed mids and controlled bass</li>
              <li>Detachable cable and fold‑flat design for travel</li>
              <li>Replaceable ear pads for long‑term use</li>
            </ul>
          </div>
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold tracking-widest">Compatibility</h2>
            <ul className="mt-4 space-y-2 text-neutral-700">
              <li>Works with phones, tablets, laptops, and audio interfaces</li>
              <li>3.5mm jack; USB‑C adapters supported</li>
              <li>Inline remote compatible with most devices</li>
              <li>Meets WCAG interaction standards for accessibility</li>
            </ul>
          </div>
        </section>
      )}

      {/* Gallery */}
      <section className="grid md:grid-cols-3 gap-6 mt-16" aria-label="Product gallery">
        {product.images.gallery.map((src: string, idx: number) => (
          <div key={idx} className="rounded overflow-hidden bg-neutral-200 aspect-[4/3]">
            {/* Use mobile src directly for placeholders */}
            <img src={src} alt={`${product.name} gallery image ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
          </div>
        ))}
      </section>

      {/* You may also like */}
      <section className="mt-16">
        <h2 className="text-center text-xl font-semibold tracking-widest">You may also like</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {related.map((rp: any) => (
            <div key={rp.id} className="text-center">
              <div className="rounded overflow-hidden bg-neutral-200 aspect-[4/3]">
                <ResponsivePicture src={rp.images.category} alt={`${rp.name} category cover`} className="w-full h-full" />
              </div>
              <h3 className="mt-4 font-semibold tracking-wide">{rp.name}</h3>
              <Link href={`/products/${rp.slug}`} className="mt-3 inline-block btn btn-primary btn-sm">See Product</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}