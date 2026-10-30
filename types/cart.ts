export interface CartLine {
  /** product id + variant, so the same product in two colors is two lines. */
  key: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  colorId?: string;
  colorName?: string;
  size?: string;
  qty: number;
  stock: number;
}

export interface PromoCode {
  code: string;
  /** Fraction off the subtotal, 0.2 = 20%. */
  percentOff: number;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  itemCount: number;
}
