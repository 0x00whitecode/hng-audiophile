import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";

export default function CategoryPage({ params }: { params: { name: string } }) {
  const name = params.name as "headphones" | "speakers" | "earphones";
  if (!["headphones", "speakers", "earphones"].includes(name)) return notFound();
  const list = products.filter((p) => p.category === name);
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-semibold uppercase tracking-widest">{name}</h1>
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}