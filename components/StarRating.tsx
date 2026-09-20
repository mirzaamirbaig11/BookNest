export default function StarRating({ value, count }: { value: number; count?: number }) {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-1 text-sm text-accent-600">
      <span aria-hidden>
        {'★'.repeat(rounded)}
        {'☆'.repeat(5 - rounded)}
      </span>
      {typeof count === 'number' && <span className="text-xs text-gray-500">({count})</span>}
    </div>
  );
}
