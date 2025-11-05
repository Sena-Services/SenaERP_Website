import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sena",
  description: "Sena: AI-centred B2B travel platform",
  icons: {
    icon: "/logo.ico",
    shortcut: "/logo.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
