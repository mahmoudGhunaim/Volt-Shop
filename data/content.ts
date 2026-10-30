import type { Localized } from "@/types/product";

/**
 * Editorial content for the help and company pages, in both languages.
 * Everything here is fictional demo copy for the VOLT store.
 */
const t = (en: string, ar: string): Localized => ({ en, ar });

export interface Faq {
  q: Localized;
  a: Localized;
}

export interface Step {
  title: Localized;
  body: Localized;
}

/* ─── Shipping ─────────────────────────────────────────── */

export const shipping = {
  title: t("Shipping", "الشحن"),
  lede: t(
    "Every order leaves our Berlin hub within one business day, tracked door to door and carbon-neutral by default.",
    "يغادر كل طلب مركزنا في برلين خلال يوم عمل واحد، مع تتبّع حتى باب منزلك وتوصيل محايد للكربون.",
  ),
  rates: [
    { method: t("Standard", "عادي"), eta: t("3–5 business days", "3–5 أيام عمل"), price: 12, freeOver: 150 },
    { method: t("Express", "سريع"), eta: t("1–2 business days", "1–2 يوم عمل"), price: 25, freeOver: null },
    { method: t("International", "دولي"), eta: t("5–10 business days", "5–10 أيام عمل"), price: 29, freeOver: 300 },
  ],
  steps: [
    { title: t("Order placed", "تم الطلب"), body: t("You get a confirmation email within a minute.", "تصلك رسالة تأكيد خلال دقيقة.") },
    { title: t("Packed", "تم التغليف"), body: t("Hand-checked and packed in recycled materials within 24 hours.", "يُفحص يدوياً ويُغلّف بمواد معاد تدويرها خلال 24 ساعة.") },
    { title: t("Shipped", "تم الشحن"), body: t("Your tracking link arrives the moment the courier scans it.", "يصلك رابط التتبّع لحظة استلام شركة الشحن للطرد.") },
    { title: t("Delivered", "تم التوصيل"), body: t("Signature-free delivery, or pick it up from a locker near you.", "توصيل دون توقيع، أو استلمه من خزانة قريبة منك.") },
  ] satisfies Step[],
  faq: [
    {
      q: t("Do you ship worldwide?", "هل تشحنون إلى كل الدول؟"),
      a: t("We ship to 38 countries across Europe, the Gulf, North America and East Asia. The full list appears at checkout.", "نشحن إلى 38 دولة في أوروبا والخليج وأمريكا الشمالية وشرق آسيا. تظهر القائمة الكاملة عند الدفع."),
    },
    {
      q: t("Can I change my address after ordering?", "هل يمكنني تغيير العنوان بعد الطلب؟"),
      a: t("Yes, until the order is packed. Reply to your confirmation email and we'll update it.", "نعم، قبل تغليف الطلب. ردّ على رسالة التأكيد وسنقوم بتحديثه."),
    },
    {
      q: t("Who pays customs and duties?", "من يدفع الرسوم الجمركية؟"),
      a: t("We do, for every country we ship to. The price you see is the price you pay.", "نحن ندفعها لكل الدول التي نشحن إليها. السعر الذي تراه هو ما تدفعه."),
    },
  ] satisfies Faq[],
};

/* ─── Returns ──────────────────────────────────────────── */

export const returns = {
  title: t("Returns", "الإرجاع"),
  lede: t(
    "Changed your mind? You have 30 days. Returns are free, and refunds land within five business days of us receiving the parcel.",
    "غيّرت رأيك؟ لديك 30 يوماً. الإرجاع مجاني، ويصلك المبلغ خلال خمسة أيام عمل من استلامنا للطرد.",
  ),
  steps: [
    { title: t("Start a return", "ابدأ الإرجاع"), body: t("Use the link in your order email. No account needed.", "استخدم الرابط في رسالة الطلب. لا حاجة لحساب.") },
    { title: t("Pack it", "غلّفه"), body: t("Original packaging if you have it. We email a prepaid label.", "في التغليف الأصلي إن وُجد. نرسل لك ملصق شحن مدفوعاً.") },
    { title: t("Drop it off", "سلّمه"), body: t("Any partner courier point or locker. Keep the receipt.", "في أي نقطة شحن أو خزانة شريكة. احتفظ بالإيصال.") },
    { title: t("Get refunded", "استرد المبلغ"), body: t("Back to your original payment method within 5 business days.", "إلى وسيلة الدفع الأصلية خلال 5 أيام عمل.") },
  ] satisfies Step[],
  accepted: [
    t("Unused items in their original condition", "المنتجات غير المستخدمة بحالتها الأصلية"),
    t("All accessories, cables and manuals included", "مع كل الملحقات والأسلاك والأدلة"),
    t("Returned within 30 days of delivery", "خلال 30 يوماً من التوصيل"),
  ],
  excluded: [
    t("In-ear products with opened hygiene seals", "السماعات الداخلية بعد فتح ختم النظافة"),
    t("Engraved or personalised items", "المنتجات المحفورة أو المخصّصة"),
    t("Gift cards", "بطاقات الهدايا"),
  ],
  faq: [
    {
      q: t("Can I exchange instead of return?", "هل يمكنني الاستبدال بدلاً من الإرجاع؟"),
      a: t("Yes. Choose 'exchange' when you start the return and we ship the new size or color as soon as yours is scanned.", "نعم. اختر «استبدال» عند بدء الإرجاع وسنشحن المقاس أو اللون الجديد فور مسح طردك."),
    },
    {
      q: t("What if my item arrived damaged?", "ماذا لو وصل المنتج تالفاً؟"),
      a: t("Send us a photo within 48 hours and we'll replace it right away. You don't need to send anything back first.", "أرسل لنا صورة خلال 48 ساعة وسنستبدله فوراً، دون الحاجة لإعادته أولاً."),
    },
  ] satisfies Faq[],
};

/* ─── Warranty ─────────────────────────────────────────── */

export const warranty = {
  title: t("Warranty", "الضمان"),
  lede: t(
    "Everything we sell is covered for two years against defects in materials and workmanship. If it fails, we fix it or replace it.",
    "كل ما نبيعه مشمول بضمان لمدة سنتين ضد عيوب المواد والتصنيع. إن تعطّل، نصلحه أو نستبدله.",
  ),
  covered: [
    t("Batteries that drop below 80% capacity", "البطاريات التي تنخفض سعتها عن 80%"),
    t("Buttons, hinges, zippers and buckles that fail", "الأزرار والمفصلات والسحّابات والأبازيم المعطّلة"),
    t("Electronics that stop working in normal use", "الإلكترونيات التي تتوقف عن العمل في الاستخدام العادي"),
    t("Stitching or seams that come apart", "الخياطة أو اللحامات التي تنفكّ"),
  ],
  notCovered: [
    t("Accidental drops, cracks or water damage", "السقوط أو الكسر أو تلف الماء العرضي"),
    t("Normal wear: scuffs, fading, patina", "الاستهلاك الطبيعي: الخدوش والبهتان"),
    t("Repairs made by third parties", "الإصلاحات التي يجريها طرف ثالث"),
  ],
  steps: [
    { title: t("Tell us what happened", "أخبرنا بما حدث"), body: t("Send your order number and a short video or photo.", "أرسل رقم الطلب وصورة أو فيديو قصيراً.") },
    { title: t("We diagnose it", "نشخّص المشكلة"), body: t("A technician replies within one business day.", "يردّ عليك فنّي خلال يوم عمل واحد.") },
    { title: t("Repair or replace", "إصلاح أو استبدال"), body: t("We ship a replacement first and send a prepaid label for the faulty one.", "نشحن البديل أولاً ونرسل ملصقاً مدفوعاً لإعادة المعطّل.") },
  ] satisfies Step[],
  faq: [
    {
      q: t("Do I need the receipt?", "هل أحتاج الإيصال؟"),
      a: t("No. Your order number is enough, and we can find it from your email address.", "لا. يكفي رقم الطلب، ويمكننا إيجاده من بريدك الإلكتروني."),
    },
    {
      q: t("Does the warranty transfer if I gift it?", "هل ينتقل الضمان إذا أهديت المنتج؟"),
      a: t("Yes. The warranty belongs to the product, not the person who bought it.", "نعم. الضمان مرتبط بالمنتج وليس بالمشتري."),
    },
  ] satisfies Faq[],
};

/* ─── Contact ──────────────────────────────────────────── */

export const contact = {
  title: t("Contact", "تواصل معنا"),
  lede: t(
    "Real people, fast answers. Most messages get a reply within four hours on business days.",
    "أشخاص حقيقيون وإجابات سريعة. نردّ على معظم الرسائل خلال أربع ساعات في أيام العمل.",
  ),
  channels: [
    { label: t("Email", "البريد الإلكتروني"), value: "hello@volt-demo.shop", href: "mailto:hello@volt-demo.shop" },
    { label: t("Live chat", "المحادثة المباشرة"), value: t("Mon–Fri, 9:00–18:00 CET", "الإثنين–الجمعة، 9:00–18:00 بتوقيت وسط أوروبا"), href: null },
    { label: t("Studio", "الاستوديو"), value: t("Volt Studio, Torstraße 1, Berlin", "استوديو فولت، تورشتراسه 1، برلين"), href: null },
  ],
  topics: [
    t("Order status", "حالة الطلب"),
    t("Returns & exchanges", "الإرجاع والاستبدال"),
    t("Warranty claim", "مطالبة بالضمان"),
    t("Product question", "سؤال عن منتج"),
    t("Something else", "أمر آخر"),
  ],
};

/* ─── About ────────────────────────────────────────────── */

export const about = {
  title: t("Fewer, better, charged.", "أقل، أفضل، ومشحون."),
  lede: t(
    "VOLT started as a shared spreadsheet between three friends who were tired of buying gear twice. It's now a small team picking the objects we'd carry ourselves.",
    "بدأت VOLT كجدول مشترك بين ثلاثة أصدقاء سئموا شراء المعدّات مرتين. واليوم نحن فريق صغير يختار الأدوات التي نحملها بأنفسنا.",
  ),
  story: [
    t(
      "We test everything for at least a month before it goes on the shelf: on commutes, in carry-ons, on desks that see twelve-hour days. Most of what we try doesn't make it.",
      "نختبر كل منتج لمدة شهر على الأقل قبل عرضه: في التنقلات، وفي حقائب السفر، وعلى مكاتب تعمل اثنتي عشرة ساعة يومياً. معظم ما نجرّبه لا يجتاز الاختبار.",
    ),
    t(
      "What survives earns a place in a catalog that stays deliberately small. Fewer products means we know each one properly, and we can stand behind it for years.",
      "ما يصمد يحجز مكاناً في كتالوج نحرص أن يبقى صغيراً. منتجات أقل تعني أننا نعرف كل منتج جيداً، ونستطيع دعمه لسنوات.",
    ),
  ],
  principles: [
    { title: t("Tested, not trended", "مُختبر، لا رائج"), body: t("A month of daily use beats any launch hype.", "شهر من الاستخدام اليومي أهم من أي ضجّة إطلاق.") },
    { title: t("Built to last", "مصنوع ليدوم"), body: t("Two-year warranty on everything, repairs before replacements.", "ضمان سنتين على كل شيء، والإصلاح قبل الاستبدال.") },
    { title: t("Honest by default", "الصدق أولاً"), body: t("Duties included, free returns, no dark patterns at checkout.", "الرسوم مشمولة، إرجاع مجاني، ولا حيل عند الدفع.") },
  ],
};

/* ─── Journal ──────────────────────────────────────────── */

export interface Post {
  slug: string;
  title: Localized;
  excerpt: Localized;
  date: string;
  readMinutes: number;
  /** Product whose cutout serves as the cover. */
  coverProductSlug: string;
  body: Localized[];
}

export const posts: Post[] = [
  {
    slug: "a-month-with-the-airpods-max",
    title: t("A month with the AirPods Max", "شهر مع AirPods Max"),
    excerpt: t(
      "Commutes, flights and a very loud office. What held up, what didn't, and who should actually buy them.",
      "تنقّلات ورحلات طيران ومكتب صاخب جداً. ما الذي صمد وما الذي لم يصمد، ومن عليه شراؤها فعلاً.",
    ),
    date: "2026-10-12",
    readMinutes: 6,
    coverProductSlug: "apple-airpods-max-silver",
    body: [
      t("We wore them for thirty days straight: two long-haul flights, a daily train commute and an open-plan office with a coffee grinder right next to the desks.", "ارتديناها ثلاثين يوماً متواصلة: رحلتان طويلتان وتنقّل يومي بالقطار ومكتب مفتوح بجواره مطحنة قهوة."),
      t("Noise cancelling is the headline, and it earns it. Engine drone disappears completely; voices fade to a murmur. The mesh headband spreads the weight better than the spec sheet suggests.", "العزل هو العنوان الأبرز ويستحقه. يختفي هدير المحركات تماماً وتخفت الأصوات إلى همس. ويوزّع الحزام الشبكي الوزن أفضل مما توحي به المواصفات."),
      t("The case is still the weak point, and they are heavy around the neck. If you live on planes, they're worth it. If you mostly listen at a desk, look at the Desk category instead.", "تبقى العلبة نقطة الضعف، وهي ثقيلة حول الرقبة. إن كنت تعيش في الطائرات فهي تستحق. أما إن كنت تستمع غالباً على مكتبك، فانظر إلى قسم المكتب بدلاً منها."),
    ],
  },
  {
    slug: "building-a-desk-that-works",
    title: t("Building a desk that works for twelve-hour days", "بناء مكتب يناسب أيام العمل الطويلة"),
    excerpt: t(
      "Three setups from the VOLT team, and the one rule they all share: fewer cables, better light.",
      "ثلاثة مكاتب من فريق VOLT، والقاعدة المشتركة بينها: أسلاك أقل وإضاءة أفضل.",
    ),
    date: "2026-09-28",
    readMinutes: 4,
    coverProductSlug: "apple-macbook-pro-14-inch-space-grey",
    body: [
      t("Every desk on our team is different, but they all started the same way: by removing things.", "كل مكتب في فريقنا مختلف، لكنها بدأت جميعاً بالطريقة نفسها: بإزالة الأشياء."),
      t("One laptop, one charger that handles everything, one light source you can aim. That's the whole base layer. Everything else has to earn its spot.", "حاسوب واحد، وشاحن واحد لكل شيء، ومصدر ضوء واحد يمكن توجيهه. هذه هي الطبقة الأساسية. وكل ما عداها عليه أن يستحق مكانه."),
      t("The result is a desk that's calmer to sit at and a lot faster to pack up on Friday.", "والنتيجة مكتب أهدأ للجلوس عليه وأسرع بكثير في الترتيب يوم الجمعة."),
    ],
  },
  {
    slug: "how-we-pick-sneakers",
    title: t("How we pick sneakers (and why we stock so few)", "كيف نختار الأحذية (ولماذا نعرض القليل منها)"),
    excerpt: t(
      "Two hundred kilometers of walking tests, one spreadsheet and a lot of saying no.",
      "مئتا كيلومتر من اختبارات المشي، وجدول واحد، والكثير من الرفض.",
    ),
    date: "2026-09-03",
    readMinutes: 5,
    coverProductSlug: "puma-future-rider-trainers",
    body: [
      t("Every pair we stock has walked at least two hundred kilometers on someone from the team, in rain and on hot pavement.", "كل زوج نعرضه مشى مئتي كيلومتر على الأقل بأقدام أحد أفراد الفريق، تحت المطر وعلى الأرصفة الحارّة."),
      t("We track comfort at hour one and hour eight, how the outsole wears, and whether it still looks good after a month. Most pairs fail on the last one.", "نقيس الراحة في الساعة الأولى والثامنة، وتآكل النعل، وهل يبقى المظهر جيداً بعد شهر. ومعظم الأزواج تفشل في الأخير."),
      t("That's why the Kicks category is short. We'd rather show you three pairs we'd wear than thirty we wouldn't.", "لهذا قسم الأحذية قصير. نفضّل أن نعرض ثلاثة أزواج نرتديها على ثلاثين لا نرتديها."),
    ],
  },
];

/* ─── Careers ──────────────────────────────────────────── */

export const careers = {
  title: t("Build the store you'd shop at.", "ابنِ المتجر الذي تودّ التسوّق منه."),
  lede: t(
    "We're a team of 14 across Berlin and Dubai. Small enough that your work ships next week, big enough to do it properly.",
    "نحن فريق من 14 شخصاً بين برلين ودبي. صغير بما يكفي لتُطلق عملك الأسبوع القادم، وكبير بما يكفي لإتقانه.",
  ),
  perks: [
    t("Four-day weeks in August", "أسبوع عمل من أربعة أيام في أغسطس"),
    t("€1,500 yearly gear budget", "ميزانية معدّات سنوية 1,500 يورو"),
    t("Remote-first, offices in Berlin and Dubai", "العمل عن بُعد أولاً، مع مكتبين في برلين ودبي"),
    t("Learning budget and conference trips", "ميزانية للتعلّم وحضور المؤتمرات"),
  ],
  roles: [
    { title: t("Senior Frontend Engineer", "مهندس واجهات أمامية أول"), team: t("Engineering", "الهندسة"), location: t("Remote, EU", "عن بُعد، أوروبا") },
    { title: t("Product Designer", "مصمم منتجات"), team: t("Design", "التصميم"), location: t("Berlin", "برلين") },
    { title: t("Customer Experience Lead", "قائد تجربة العملاء"), team: t("Support", "الدعم"), location: t("Dubai", "دبي") },
    { title: t("Supply Chain Analyst", "محلل سلاسل الإمداد"), team: t("Operations", "العمليات"), location: t("Berlin", "برلين") },
  ],
  note: t("These roles are fictional: VOLT is a demo store.", "هذه الوظائف خيالية: VOLT متجر تجريبي."),
};
