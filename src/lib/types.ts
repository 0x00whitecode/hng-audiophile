export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "headphones" | "speakers" | "earphones";
  description: string;
  price: number;
  images: {
    hero: { desktop: string; tablet: string; mobile: string };
    category: { desktop: string; tablet: string; mobile: string };
    gallery: string[];
  };
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type Customer = {
  name: string;
  email: string;
  phone: string;
};

export type Shipping = {
  address: string;
  city: string;
  country: string;
  zip: string;
};

export type OrderTotals = {
  subtotal: number;
  shipping: number;
  tax: number;
  grandTotal: number;
};

export type Order = {
  id: string;
  customer: Customer;
  shipping: Shipping;
  items: CartItem[];
  totals: OrderTotals;
  status: "processing" | "completed";
  createdAt: number;
};