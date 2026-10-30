import type { CategorySlug, Localized } from "@/types/product";

export interface RawCategory {
  slug: CategorySlug;
  name: Localized;
  tagline: Localized;
  /** DummyJSON product whose cutout represents the category until /public/categories/<slug>.webp exists. */
  coverProductId: number;
}

export const categories: RawCategory[] = [
  { slug: "audio", name: { en: "Audio", ar: "الصوت" }, tagline: { en: "Silence on demand", ar: "هدوء عند الطلب" }, coverProductId: 101 },
  { slug: "wear", name: { en: "Wear", ar: "الساعات" }, tagline: { en: "Time, engineered", ar: "الوقت بدقة هندسية" }, coverProductId: 98 },
  { slug: "carry", name: { en: "Carry", ar: "الحقائب" }, tagline: { en: "Pack light, move fast", ar: "احمل أقل، تحرّك أسرع" }, coverProductId: 173 },
  { slug: "desk", name: { en: "Desk", ar: "المكتب" }, tagline: { en: "A setup worth sitting at", ar: "مكتب يستحق الجلوس" }, coverProductId: 78 },
  { slug: "kicks", name: { en: "Kicks", ar: "الأحذية" }, tagline: { en: "Grip the ground", ar: "ثبات في كل خطوة" }, coverProductId: 88 },
];
