import Link from "next/link";
import type { Product } from "@/lib/types";
import ResponsivePicture from "./ResponsivePicture";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="rounded-lg bg-neutral-200 overflow-hidden">
      <div className="aspect-[4/3] bg-neutral-300">
        <ResponsivePicture src={product.images.category} alt={`${product.name} category image`} className="w-full h-full" />
      </div>
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold tracking-wide">{product.name}</h3>
        <Link
          href={`/products/${product.slug}`}
          className="mt-4 btn btn-primary btn-sm"
        >
          See Product
        </Link>
      </div>
    </div>
  );
}