import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PM茶水间 - 产品经理专属社区",
  description: "产品经理的知识库、讨论区、工具箱 — 在这里成长，不孤独",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
