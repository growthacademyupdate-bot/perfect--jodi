import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Providers } from "@/components/common/Providers";
import "@/styles.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Perfect Jodi — Indian Matrimony",
  description: "Find your perfect life partner with verified Indian matrimonial profiles.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Perfect Jodi — Indian Matrimony",
    description: "Find your perfect life partner with verified Indian matrimonial profiles.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${cormorant.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
