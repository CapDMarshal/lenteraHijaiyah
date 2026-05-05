import type { Metadata } from "next";
import { Montserrat_Alternates } from "next/font/google";
import "./globals.css";

const montserratAlternates = Montserrat_Alternates({
  variable: "--font-montserrat-alternates",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Lentera Hijaiyah",
  description: "Platform pembelajaran huruf hijaiyah dan modul islami untuk siswa/i SMPN 1 Seyegan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserratAlternates.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
