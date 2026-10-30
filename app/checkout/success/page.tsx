import type { Metadata } from "next";
import { OrderSuccess } from "@/components/checkout/order-success";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false },
};

export default function SuccessPage() {
  return <OrderSuccess />;
}
