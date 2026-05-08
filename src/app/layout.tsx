import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextX HRM - LSEV",
  description: "Giao diện HRM theo tài liệu SRS v2.1 của LSEV",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
