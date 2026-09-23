import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "Akshay Iyer | Sci-Fi Portfolio",
  description: "Lead Analyst & Trainer — interactive sci-fi portfolio",
  metadataBase: new URL("https://github.com/Anonymousakki23/portfolio"),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
