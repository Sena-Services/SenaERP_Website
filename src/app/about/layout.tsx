import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Sena",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
