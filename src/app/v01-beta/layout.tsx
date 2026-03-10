import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "v0.1 Beta — Sena",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
