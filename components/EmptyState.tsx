export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
      <span className="mb-3 text-4xl">📭</span>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
