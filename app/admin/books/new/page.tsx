import BookForm from '@/components/admin/BookForm';

export const metadata = { title: 'Add Book' };

export default function NewBookPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Add Book</h1>
      <BookForm />
    </div>
  );
}
