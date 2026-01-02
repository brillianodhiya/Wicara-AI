import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./theme-fix.css";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wicara AI - Your Meeting Assistant with Data Sovereignty",
  description: "Transcribe, analyze, and transform your meetings with AI-powered tools. Your keys, your data, your control.",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body className={`${inter.className} text-[#262B40]`} style={{ backgroundColor: '#ffffff', color: '#262B40' }}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
