import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Instrument_Sans } from "next/font/google";
import { metadataCopy } from "@/content/home";
import { organizationJsonLd } from "@/lib/jsonLd";
import "./globals.css";

// Variable font: one file covers the 400–700 weights the design uses.
const instrumentSans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  display: "swap",
  variable: "--font-instrument-sans",
});

export const metadata: Metadata = {
  title: metadataCopy.title,
  description: metadataCopy.description,
};

const jsonLd = organizationJsonLd(metadataCopy.description);

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={instrumentSans.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <div className="page">{children}</div>
      </body>
    </html>
  );
}
