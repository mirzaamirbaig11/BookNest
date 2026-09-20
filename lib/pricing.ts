export const FREE_SHIPPING_THRESHOLD = 499;
export const SHIPPING_FEE = 49;

export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}
