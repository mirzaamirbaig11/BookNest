/** Human-readable, sortable order number. Uniqueness is enforced by the DB unique constraint;
 *  on the rare collision the caller should retry with a fresh call. */
export function generateOrderNumber(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `BN${datePart}${randomPart}`;
}
