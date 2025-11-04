import type { Product } from "@/lib/types";

export const products: Product[] = [
  {
    id: "xx99m2",
    slug: "xx99-mark-two-headphones",
    name: "XX99 Mark II Headphones",
    category: "headphones",
    description:
      "The pinnacle of pristine audio. Experience natural, lifelike sound with superb detail and control.",
    price: 2999,
    images: {
      hero: {
        desktop: "/images/hero1.png",
        tablet: "/images/hero1.png",
        mobile: "/images/hero1.png",
      },
      category: {
        desktop: "/images/1.png",
        tablet: "/images/1.png",
        mobile: "/images/1.png",
      },
      gallery: ["/images/placeholder.svg", "/images/placeholder.svg", "/images/placeholder.svg"],
    },
  },
  {
    id: "zx9",
    slug: "zx9-speaker",
    name: "ZX9 Speaker",
    category: "speakers",
    description:
      "An upgrade to premium speakers. Enjoy clear, room-filling sound with exceptional bass response.",
    price: 4500,
    images: {
      hero: {
        desktop: "/images/zx9/hero-desktop.svg",
        tablet: "/images/zx9/hero-tablet.svg",
        mobile: "/images/zx9/hero-mobile.svg",
      },
      category: {
        desktop: "/images/3.png",
        tablet: "/images/3.png",
        mobile: "/images/3.png",
      },
      gallery: ["/images/placeholder.svg", "/images/placeholder.svg", "/images/placeholder.svg"],
    },
  },
  {
    id: "zx7",
    slug: "zx7-speaker",
    name: "ZX7 Speaker",
    category: "speakers",
    description:
      "Exceptional performance at an incredible value. Designed for balanced, accurate sound reproduction.",
    price: 3500,
    images: {
      hero: {
        desktop: "/images/zx7/hero-desktop.svg",
        tablet: "/images/zx7/hero-tablet.svg",
        mobile: "/images/zx7/hero-mobile.svg",
      },
      category: {
        desktop: "/images/zx7/category-desktop.svg",
        tablet: "/images/zx7/category-tablet.svg",
        mobile: "/images/zx7/category-mobile.svg",
      },
      gallery: ["/images/placeholder.svg", "/images/placeholder.svg", "/images/placeholder.svg"],
    },
  },
  {
    id: "yx1",
    slug: "yx1-earphones",
    name: "YX1 Earphones",
    category: "earphones",
    description:
      "Compact and comfortable with refined audio clarity. Ideal for everyday listening.",
    price: 599,
    images: {
      hero: {
        desktop: "/images/yx1/hero-desktop.svg",
        tablet: "/images/yx1/hero-tablet.svg",
        mobile: "/images/yx1/hero-mobile.svg",
      },
      category: {
        desktop: "/images/2.png",
        tablet: "/images/2.png",
        mobile: "/images/2.png",
      },
      gallery: ["/images/placeholder.svg", "/images/placeholder.svg", "/images/placeholder.svg"],
    },
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}