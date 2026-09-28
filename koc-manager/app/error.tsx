"use client";

export default function Error({ error }: { error: Error & { digest?: string } }) {
  return (
    <div className="max-w-lg mx-auto mt-16 border border-line rounded-lg p-6 bg-surface text-sm">
      <h2 className="font-semibold mb-2">Chưa kết nối được cơ sở dữ liệu</h2>
      <p className="text-muted mb-3">{error.message}</p>
      <p className="text-muted">
        Kiểm tra lại 2 biến môi trường <code className="bg-page px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> và{" "}
        <code className="bg-page px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> — xem hướng dẫn trong README.md.
      </p>
    </div>
  );
}
