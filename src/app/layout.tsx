import type { Metadata } from "next";
import { Instrument_Sans, PT_Mono } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const ptMono = PT_Mono({
  variable: "--font-pt-mono",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OS10 Document Pre-Check MVP",
  description:
    "Pre-chequeo documental de certificados OS10 para detectar inconsistencias de identidad y formato antes de la revisión final.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${instrumentSans.variable} ${ptMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
