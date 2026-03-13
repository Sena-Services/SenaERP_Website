import type { Metadata, Viewport } from "next";
import { Tangerine } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/shared/LoadingScreen";

const tangerine = Tangerine({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-tangerine",
});

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
    <html lang="en" suppressHydrationWarning={true} className={tangerine.variable}>
      <body className="antialiased overflow-x-hidden" suppressHydrationWarning={true}>
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
