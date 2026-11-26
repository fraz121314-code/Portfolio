import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const sans = Geist({ variable: "--font-sans-loaded", subsets: ["latin"] });
const serif = Instrument_Serif({ variable: "--font-serif", weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${site.name}: Portfolio`,
  description: `${site.name}, ${site.role}. An interactive portfolio and CV.`,
};

export const viewport: Viewport = {
  themeColor: "#07080a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
