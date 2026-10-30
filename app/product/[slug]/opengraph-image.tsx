import { siteConfig } from "@/config/site";
import { getProductBySlug } from "@/lib/api";
import { ogSize, renderOg } from "@/lib/og";
import { formatPrice } from "@/lib/utils";

export const alt = `${siteConfig.name} product`;
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return renderOg({ title: "Signal lost.", subtitle: siteConfig.tagline.en });
  }
  return renderOg({
    title: product.name,
    subtitle: `${product.brand} · ${product.tagline.en}`,
    image: product.images[0]?.src,
    price: formatPrice(product.price),
  });
}
