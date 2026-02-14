import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Sena",
  description: "Sena: AI-centred B2B travel platform",
  icons: {
    icon: "/sena-logo-pinwheel.png",
    shortcut: "/sena-logo-pinwheel.png",
    apple: "/sena-logo-pinwheel.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tangerine:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased overflow-x-hidden" suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
