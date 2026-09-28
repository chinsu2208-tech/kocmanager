import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "KOC Manager — Quản lý KOC & hiệu quả chiến dịch",
  description: "Quản lý KOC lên bài TikTok cho sản phẩm, theo dõi hiệu quả theo thời gian.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-page text-ink">
        <Nav />
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
