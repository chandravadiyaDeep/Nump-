import type { Metadata } from "next";
import "./globals.css";
import "./landing.css";

// Shared metadata defaults for the NUMPA workspace and public discovery pages.
export const metadata: Metadata = {
  metadataBase: new URL("https://numpa.online"),
  title: { default: "NUMPA — Data Analysis and ML Readiness", template: "%s" },
  description:
    "Inspect, clean, and assess the machine-learning readiness of tabular datasets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
