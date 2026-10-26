import type { Metadata } from "next";
import "./globals.css";

// Shared metadata for NUMPA's first web workflow.
export const metadata: Metadata = {
  title: "NUMPA — Dataset Quality Studio",
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
