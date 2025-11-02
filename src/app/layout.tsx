import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Markdown to PDF Converter | Create Beautiful PDFs from Markdown",
  description:
    "Transform your Markdown documents into professionally formatted PDFs. Support for math formulas, code highlighting, diagrams, and more. Free and open source.",
  keywords: [
    "markdown",
    "pdf",
    "converter",
    "markdown to pdf",
    "pdf generator",
    "latex",
    "code highlighting",
  ],
  authors: [{ name: "Markdown to PDF Converter" }],
  openGraph: {
    title: "Markdown to PDF Converter",
    description:
      "Create beautiful PDFs from Markdown with extended features support",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
