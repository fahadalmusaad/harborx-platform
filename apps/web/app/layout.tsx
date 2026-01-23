import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HarborX - Freight Management Platform",
  description: "Modern freight management platform for the Middle East",
  manifest: "/manifest.json",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
