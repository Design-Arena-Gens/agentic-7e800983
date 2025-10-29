import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AetherVPN Command Center",
  description:
    "Real-time VPN intelligence dashboard with live IP insights and global server fleet management."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
