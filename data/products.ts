import type { CategorySlug, Localized, ProductColor } from "@/types/product";

/**
 * VOLT's merchandising layer on top of DummyJSON (https://dummyjson.com/products).
 * The API supplies name, brand, price, stock, rating, images, reviews and logistics.
 * This file decides which products the store carries and adds what the API doesn't have:
 * VOLT category, color and size variants, "new" flags, featured order and Arabic copy.
 */
export interface ProductEnrichment {
  /** DummyJSON product id. */
  id: number;
  category: CategorySlug;
  colors: ProductColor[];
  sizes?: string[];
  isNew?: boolean;
  featuredRank: number;
  /** Day the product "launched" in VOLT, drives the newest sort. */
  releasedAt: string;
  tagline: Localized;
  /** Arabic description. English comes from the API. */
  descriptionAr: string;
}

const c = {
  ink: { id: "ink", name: { en: "Ink", ar: "حبري" }, hex: "#15151F" },
  graphite: { id: "graphite", name: { en: "Graphite", ar: "جرافيت" }, hex: "#3A3A46" },
  silver: { id: "silver", name: { en: "Silver", ar: "فضي" }, hex: "#C9CACF" },
  chalk: { id: "chalk", name: { en: "Chalk", ar: "طباشيري" }, hex: "#ECEAE4" },
  gold: { id: "gold", name: { en: "Gold", ar: "ذهبي" }, hex: "#D8B46A" },
  lime: { id: "lime", name: { en: "Volt Lime", ar: "ليموني" }, hex: "#C6FF3D" },
  violet: { id: "violet", name: { en: "Violet", ar: "بنفسجي" }, hex: "#7C5CFF" },
  cognac: { id: "cognac", name: { en: "Cognac", ar: "كونياك" }, hex: "#9A5B32" },
  navy: { id: "navy", name: { en: "Navy", ar: "كحلي" }, hex: "#22305E" },
  sky: { id: "sky", name: { en: "Sky", ar: "سماوي" }, hex: "#8FD3E8" },
  ember: { id: "ember", name: { en: "Ember", ar: "جمري" }, hex: "#E0352B" },
} satisfies Record<string, ProductColor>;

const shoeSizes = ["40", "41", "42", "43", "44", "45"];

export const catalog: ProductEnrichment[] = [
  // ─── Audio ───────────────────────────────────────────
  {
    id: 101, category: "audio", colors: [c.silver, c.graphite, c.violet], featuredRank: 1, releasedAt: "2026-03-12",
    tagline: { en: "Over-ear, all in", ar: "سماعة كاملة بلا تنازلات" },
    descriptionAr: "سماعات فوق الأذن بصوت عالي الدقة ومعادل تكيّفي وعزل نشط للضوضاء. تجربة صوت غامرة بتصميم أنيق.",
  },
  {
    id: 100, category: "audio", colors: [c.chalk], isNew: true, featuredRank: 4, releasedAt: "2026-09-02",
    tagline: { en: "Pocket-size, always ready", ar: "بحجم الجيب وجاهزة دائماً" },
    descriptionAr: "سماعات لاسلكية بإعداد سهل وصوت واضح وراحة تدوم طوال اليوم، مع علبة شحن صغيرة تناسب جيبك.",
  },
  {
    id: 107, category: "audio", colors: [c.lime, c.ink], featuredRank: 14, releasedAt: "2025-11-20",
    tagline: { en: "Neckband freedom", ar: "حرية سماعة الرقبة" },
    descriptionAr: "سماعات لاسلكية مرنة بتصميم يلتف حول الرقبة، وصوت قوي وبطارية تدوم طوال يومك.",
  },
  {
    id: 103, category: "audio", colors: [c.graphite, c.chalk], featuredRank: 10, releasedAt: "2025-08-04",
    tagline: { en: "Room-filling sphere", ar: "كرة تملأ الغرفة بالصوت" },
    descriptionAr: "مكبر صوت ذكي صغير بصوت يملأ المكان ومساعد صوتي مدمج، بتصميم كروي يناسب أي زاوية.",
  },
  {
    id: 99, category: "audio", colors: [c.graphite], featuredRank: 19, releasedAt: "2025-05-15",
    tagline: { en: "Voice-first speaker", ar: "مكبر صوت يستجيب لصوتك" },
    descriptionAr: "مكبر صوت ذكي بمساعد صوتي ومركز للمنزل الذكي، يتحكم بأجهزتك ويشغّل موسيقاك بأمر واحد.",
  },

  // ─── Wear ────────────────────────────────────────────
  {
    id: 106, category: "wear", colors: [c.gold, c.silver, c.graphite], sizes: ["40 mm", "44 mm"], featuredRank: 3, releasedAt: "2026-01-28",
    tagline: { en: "Health on your wrist", ar: "صحتك على معصمك" },
    descriptionAr: "ساعة ذكية بإطار ذهبي تتابع صحتك ولياقتك وتبقيك على اتصال، بتصميم أنيق يناسب كل يوم.",
  },
  {
    id: 94, category: "wear", colors: [c.silver], sizes: ["40 mm"], featuredRank: 9, releasedAt: "2025-10-10",
    tagline: { en: "Moonphase heritage", ar: "إرث أطوار القمر" },
    descriptionAr: "ساعة فاخرة بتصميم كلاسيكي ومؤشر لأطوار القمر وحركة دقيقة، تجمع بين الأناقة والحِرفة.",
  },
  {
    id: 98, category: "wear", colors: [c.ink, c.gold], sizes: ["41 mm"], isNew: true, featuredRank: 6, releasedAt: "2026-08-21",
    tagline: { en: "The dive icon", ar: "أيقونة ساعات الغوص" },
    descriptionAr: "ساعة غوص أيقونية بإطار دوّار ومقاومة عالية للماء، صُممت للمغامرة والأناقة معاً.",
  },
  {
    id: 190, category: "wear", colors: [c.silver], sizes: ["40 mm"], featuredRank: 16, releasedAt: "2025-09-14",
    tagline: { en: "Engineered steel", ar: "فولاذ بدقة هندسية" },
    descriptionAr: "ساعة أوتوماتيكية من الفولاذ بخطوط هندسية واضحة، تجمع بين المتانة والدقة.",
  },
  {
    id: 93, category: "wear", colors: [c.cognac], sizes: ["38 mm", "42 mm"], featuredRank: 17, releasedAt: "2025-06-30",
    tagline: { en: "Leather and a clean dial", ar: "جلد ومينا نظيف" },
    descriptionAr: "ساعة بحزام جلدي بني ومينا بسيط، إطلالة كلاسيكية تناسب الأيام العادية والمناسبات.",
  },
  {
    id: 194, category: "wear", colors: [c.silver, c.gold], sizes: ["32 mm"], featuredRank: 20, releasedAt: "2025-04-12",
    tagline: { en: "Slim steel everyday", ar: "ساعة فولاذية رفيعة لكل يوم" },
    descriptionAr: "ساعة يد رفيعة بسوار فولاذي ومينا داكن، أناقة هادئة لكل يوم.",
  },

  // ─── Carry ───────────────────────────────────────────
  {
    id: 175, category: "carry", colors: [c.chalk, c.ink], isNew: true, featuredRank: 7, releasedAt: "2026-07-11",
    tagline: { en: "Clean-lined daypack", ar: "حقيبة ظهر بخطوط نظيفة" },
    descriptionAr: "حقيبة ظهر من الجلد الصناعي الأبيض بتصميم بسيط ومساحة كافية لأغراض يومك.",
  },
  {
    id: 173, category: "carry", colors: [c.cognac, c.ink], featuredRank: 8, releasedAt: "2026-02-08",
    tagline: { en: "Full-grain, built to age", ar: "جلد طبيعي يزداد جمالاً مع الوقت" },
    descriptionAr: "حقيبة من الجلد الطبيعي بتصميم عملي وأنيق، تزداد جمالاً مع الاستعمال.",
  },
  {
    id: 176, category: "carry", colors: [c.ink], featuredRank: 13, releasedAt: "2025-07-19",
    tagline: { en: "Structured, all black", ar: "تصميم متماسك بالأسود الكامل" },
    descriptionAr: "حقيبة يد سوداء بهيكل متماسك ومقابض قوية، تناسب العمل والمساء.",
  },
  {
    id: 172, category: "carry", colors: [c.navy, c.ink], featuredRank: 21, releasedAt: "2025-04-02",
    tagline: { en: "Deep navy tote", ar: "حقيبة كحلية عميقة" },
    descriptionAr: "حقيبة يد كحلية واسعة بتصميم بسيط، رفيقة مثالية للتنقل اليومي.",
  },
  {
    id: 174, category: "carry", colors: [c.sky, c.ink], featuredRank: 11, releasedAt: "2025-12-03",
    tagline: { en: "Saffiano in sky blue", ar: "جلد سافيانو بلون سماوي" },
    descriptionAr: "حقيبة فاخرة من جلد سافيانو بلون سماوي ناعم ومقابض مزدوجة.",
  },

  // ─── Desk ────────────────────────────────────────────
  {
    id: 78, category: "desk", colors: [c.graphite, c.silver], sizes: ["512 GB", "1 TB"], featuredRank: 2, releasedAt: "2026-04-17",
    tagline: { en: "The pro machine", ar: "الجهاز الاحترافي" },
    descriptionAr: "حاسوب محمول بأداء احترافي وشاشة مذهلة وبطارية تدوم طويلاً، صُمّم للإبداع بلا حدود.",
  },
  {
    id: 79, category: "desk", colors: [c.graphite], sizes: ["1 TB"], featuredRank: 12, releasedAt: "2025-12-01",
    tagline: { en: "Two screens, one flow", ar: "شاشتان وتدفّق واحد" },
    descriptionAr: "حاسوب محمول بشاشتين يمنحك مساحة عمل إضافية لتعدد المهام بسلاسة.",
  },
  {
    id: 159, category: "desk", colors: [c.chalk, c.graphite, c.violet], sizes: ["64 GB", "256 GB"], isNew: true, featuredRank: 5, releasedAt: "2026-09-18",
    tagline: { en: "Small slate, full power", ar: "لوح صغير بقوة كاملة" },
    descriptionAr: "جهاز لوحي صغير بقوة كاملة، مثالي للرسم والقراءة والعمل أثناء التنقل.",
  },
  {
    id: 102, category: "desk", colors: [c.chalk], featuredRank: 18, releasedAt: "2025-10-28",
    tagline: { en: "Drop it, charge it", ar: "ضعه واشحنه" },
    descriptionAr: "شاحن لاسلكي يشحن عدة أجهزة في الوقت نفسه، فقط ضعها عليه.",
  },
  {
    id: 105, category: "desk", colors: [c.chalk], featuredRank: 22, releasedAt: "2025-02-11",
    tagline: { en: "Snap-on reserve power", ar: "طاقة احتياطية تلتصق بهاتفك" },
    descriptionAr: "بطارية مغناطيسية تلتصق بظهر هاتفك لشحن إضافي في أي مكان.",
  },

  // ─── Kicks ───────────────────────────────────────────
  {
    id: 88, category: "kicks", colors: [c.ember, c.ink], sizes: shoeSizes, featuredRank: 0, releasedAt: "2026-10-01",
    tagline: { en: "Court legend, red and black", ar: "أسطورة الملاعب بالأحمر والأسود" },
    descriptionAr: "حذاء أيقوني بألوان الأحمر والأسود وتصميم مرتفع، يجمع تاريخ الملاعب بأسلوب الشارع.",
  },
  {
    id: 90, category: "kicks", colors: [c.lime, c.navy], sizes: shoeSizes, isNew: true, featuredRank: 15, releasedAt: "2026-05-22",
    tagline: { en: "Retro runner, loud colors", ar: "حذاء جري كلاسيكي بألوان جريئة" },
    descriptionAr: "حذاء رياضي بروح كلاسيكية وألوان جريئة ونعل مريح لكل يوم.",
  },
  {
    id: 91, category: "kicks", colors: [c.chalk, c.ember], sizes: shoeSizes, featuredRank: 23, releasedAt: "2025-06-12",
    tagline: { en: "Off-white with a red arrow", ar: "أبيض مع سهم أحمر" },
    descriptionAr: "حذاء رياضي أبيض بلمسة حمراء جريئة، تصميم عصري يلفت الأنظار.",
  },
];
