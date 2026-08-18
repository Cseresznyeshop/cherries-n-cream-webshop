import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display", weight: ["400", "500", "600"] });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "Cherries N' Cream",
  description: "Diszkrét intim wellness webshop — Cherries N' Cream",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <AgeGate />
        <Header />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
