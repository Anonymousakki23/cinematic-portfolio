import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Navigation } from "@/components/navigation";

const siteUrl = "https://akshayiyer.info";

export const metadata: Metadata = {
  title: {
    default: "Akshay Iyer | Cinematic Portfolio",
    template: "%s | Akshay Iyer",
  },
  description:
    "Lead Analyst & Trainer based in Kraków — data analytics, global training leadership, and photography.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Akshay Iyer | Cinematic Portfolio",
    description:
      "Lead Analyst & Trainer based in Kraków — data analytics, global training leadership, and photography.",
    siteName: "Akshay Iyer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akshay Iyer | Cinematic Portfolio",
    description:
      "Lead Analyst & Trainer based in Kraków — data analytics, global training leadership, and photography.",
  },
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
