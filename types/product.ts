export type Locale = "en" | "ar";

/** Copy that changes with the active locale. */
export interface Localized {
  en: string;
  ar: string;
}

export type CategorySlug = "audio" | "wear" | "carry" | "desk" | "kicks";

export interface Category {
  slug: CategorySlug;
  name: Localized;
  tagline: Localized;
  image: ProductImage;
  /** 'photo' = generated scene in /public/categories, 'cutout' = transparent product render. */
  imageKind: "photo" | "cutout";
}

export interface ProductColor {
  id: string;
  name: Localized;
  /** Swatch fill, any CSS color. */
  hex: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export type SpecKey =
  | "brand"
  | "sku"
  | "weight"
  | "dimensions"
  | "warranty"
  | "shipping"
  | "returns";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  /** Transparent cutouts. First is primary, second (when present) is the hover image. */
  images: ProductImage[];
  category: CategorySlug;
  colors: ProductColor[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  isNew: boolean;
  /** Lower comes first in the "featured" sort. */
  featuredRank: number;
  /** ISO date, used for the "newest" sort. */
  releasedAt: string;
  tagline: Localized;
  description: Localized;
  specs: Partial<Record<SpecKey, string>>;
  reviews: Review[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  body: string;
  date: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: Localized;
  quote: Localized;
  productSlug: string;
}
