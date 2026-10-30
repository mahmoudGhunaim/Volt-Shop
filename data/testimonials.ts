import type { Testimonial } from "@/types/product";

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    author: "Dana Whitfield",
    role: { en: "Product designer, Berlin", ar: "مصممة منتجات، برلين" },
    quote: {
      en: "Ordered the AirPods Max on a Tuesday, wore them on a Thursday flight. The checkout took less time than finding my passport.",
      ar: "طلبت AirPods Max يوم الثلاثاء وارتديتها في رحلة الخميس. استغرق الدفع وقتاً أقل من البحث عن جواز سفري.",
    },
    productSlug: "apple-airpods-max-silver",
  },
  {
    id: "t2",
    author: "Karim Haddad",
    role: { en: "Sneaker collector, Dubai", ar: "جامع أحذية، دبي" },
    quote: {
      en: "VOLT is the only store where the product photos look exactly like what shows up at the door. The Jordans were perfect.",
      ar: "VOLT المتجر الوحيد الذي تبدو صور منتجاته تماماً كما تصل إلى الباب. حذاء جوردن كان مثالياً.",
    },
    productSlug: "nike-air-jordan-1-red-and-black",
  },
  {
    id: "t3",
    author: "Mei Tanaka",
    role: { en: "Software engineer, Tokyo", ar: "مهندسة برمجيات، طوكيو" },
    quote: {
      en: "I rebuilt my whole desk from the Desk category. Fast shipping, zero friction, and the promo code actually worked.",
      ar: "أعدت بناء مكتبي كاملاً من قسم المكتب. شحن سريع بلا أي تعقيد، ورمز الخصم عمل فعلاً.",
    },
    productSlug: "apple-macbook-pro-14-inch-space-grey",
  },
  {
    id: "t4",
    author: "Alex Moreau",
    role: { en: "Photographer, Lyon", ar: "مصوّر، ليون" },
    quote: {
      en: "The Heshe bag survived a week of rain in Scotland and looks better for it. Real leather, real stitching.",
      ar: "صمدت حقيبة Heshe أسبوعاً من المطر في اسكتلندا وأصبحت أجمل. جلد حقيقي وخياطة حقيقية.",
    },
    productSlug: "heshe-womens-leather-bag",
  },
];
