import type { Metadata } from "next";
import { WishlistView } from "@/components/shop/wishlist-view";
import { getProducts } from "@/lib/api";

export const metadata: Metadata = {
  title: "Wishlist",
  robots: { index: false },
};

export default async function WishlistPage() {
  const products = await getProducts();
  return <WishlistView products={products} />;
}
