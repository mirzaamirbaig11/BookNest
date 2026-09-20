import QRCode from 'qrcode';

/**
 * Builds a standard UPI deep-link URI ("intent") for a payment request.
 * Spec: https://www.npci.org.in/what-we-do/upi/product-overview (BHIM UPI deep link format)
 *
 * pa = payee address (UPI ID)
 * pn = payee name
 * tr = transaction reference (our order number — lets the payer's UPI app show a reference)
 * am = amount
 * cu = currency
 * tn = transaction note
 */
export function buildUpiUri(params: {
  amount: number;
  orderNumber: string;
  upiId?: string;
  merchantName?: string;
}): string {
  const upiId = params.upiId ?? process.env.UPI_ID;
  const merchantName = params.merchantName ?? process.env.UPI_MERCHANT_NAME ?? 'BookNest';
  if (!upiId) throw new Error('UPI_ID is not configured in environment variables.');

  const query = new URLSearchParams({
    pa: upiId,
    pn: merchantName,
    tr: params.orderNumber,
    am: params.amount.toFixed(2),
    cu: 'INR',
    tn: `BookNest order ${params.orderNumber}`,
  });

  return `upi://pay?${query.toString()}`;
}

/** Returns a data: URL PNG QR code encoding the given UPI URI. Generated fresh per order. */
export async function generateUpiQrDataUrl(upiUri: string): Promise<string> {
  return QRCode.toDataURL(upiUri, { margin: 1, width: 320 });
}

/** A short, order-scoped reference the admin can match against the UTR the buyer reports. */
export function buildPayeeReference(orderNumber: string): string {
  return `BN-${orderNumber}`;
}
