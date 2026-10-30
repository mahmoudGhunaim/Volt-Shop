import { z } from "zod";

/**
 * Error messages are dictionary keys (t.checkout.errors[key]) so validation
 * speaks the active language without the schema knowing about i18n.
 */
export const shippingSchema = z.object({
  email: z.string().trim().min(1, "required").email("email"),
  phone: z
    .string()
    .trim()
    .min(1, "required")
    .regex(/^\+?[\d\s()-]{7,20}$/, "phone"),
  firstName: z.string().trim().min(1, "required"),
  lastName: z.string().trim().min(1, "required"),
  street: z.string().trim().min(1, "required"),
  city: z.string().trim().min(1, "required"),
  zip: z
    .string()
    .trim()
    .min(1, "required")
    .regex(/^[A-Za-z0-9\s-]{3,10}$/, "zip"),
  country: z.string().min(1, "required"),
  method: z.enum(["standard", "express"]),
});

function validExpiry(v: string) {
  const m = /^(\d{2})\/(\d{2})$/.exec(v);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);
  return endOfMonth >= new Date();
}

export const paymentSchema = z.object({
  cardNumber: z
    .string()
    .transform((v) => v.replace(/\s/g, ""))
    .pipe(z.string().regex(/^\d{16}$/, "card")),
  cardName: z.string().trim().min(1, "required"),
  expiry: z.string().refine(validExpiry, "expiry"),
  cvc: z.string().regex(/^\d{3,4}$/, "cvc"),
});

export const checkoutSchema = shippingSchema.and(paymentSchema);
export type CheckoutInput = z.input<typeof checkoutSchema>;

export const shippingFields = Object.keys(shippingSchema.shape) as Array<keyof CheckoutInput>;
export const paymentFields = Object.keys(paymentSchema.shape) as Array<keyof CheckoutInput>;

export const EXPRESS_RATE = 25;
export const ORDER_KEY = "volt-last-order";

export const countries = [
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "United Arab Emirates",
  "Saudi Arabia",
  "Jordan",
  "Egypt",
  "Japan",
  "Canada",
];

export function formatCardNumber(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export function cardBrand(number: string): "visa" | "mastercard" | "amex" | "card" {
  const n = number.replace(/\D/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  return "card";
}

export function createOrderId() {
  return `VLT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export interface PlacedOrder {
  id: string;
  name: string;
  email: string;
  total: number;
  itemCount: number;
  eta: string;
  images: string[];
}
