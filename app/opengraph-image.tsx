import { siteConfig } from "@/config/site";
import { getProductBySlug } from "@/lib/api";
import { ogSize, renderOg } from "@/lib/og";

export const alt = `${siteConfig.name}: ${siteConfig.tagline.en}`;
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  const hero = await getProductBySlug("apple-airpods-max-silver");
  return renderOg({
    title: "Gear that hums with intent.",
    subtitle: siteConfig.tagline.en,
    image: hero?.images[0]?.src,
  });
}
