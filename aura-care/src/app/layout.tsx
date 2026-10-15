import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AURA CARE — Smart Health Management & Clinical OS",
  description:
    "A more beautiful kind of connected health. Real-time biometrics, doctor consultations, e-prescriptions, diagnostic records, and AI clinical intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#071514] text-[#FAF8F2] selection:bg-[#2DD4BF] selection:text-[#071514] font-sans">
        {children}
      </body>
    </html>
  );
}
