import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Instrument_Sans } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { metadataCopy, shell } from "@/content/overview";
import { boardDepartments } from "@/lib/departments";
import styles from "./layout.module.css";
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
  // Internal tool: keep it out of search engines.
  robots: { index: false, follow: false },
};

const navItems = boardDepartments.map((d) => ({
  id: d.id,
  label: d.label,
  count: d.teamSize === null ? shell.noTeamSize : String(d.teamSize),
}));

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={instrumentSans.variable}>
      <body>
        <div className={styles.shell}>
          <Sidebar items={navItems} />
          <div className={styles.main}>
            <TopBar />
            <main id="overview" className={styles.content}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
