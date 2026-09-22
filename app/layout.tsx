import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChiefOS - Permissioned Multi-Agent Operating System",
  description: "Professional multi-agent OS with liquid-glass design, capability tokens, and human oversight",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
