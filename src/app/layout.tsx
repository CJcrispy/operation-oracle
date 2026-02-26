import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UNLOCKER.sys",
  description: "Windows 98 Terminal Shell - ECTH Distro",
  viewport: { width: "device-width", initialScale: 1, maximumScale: 5 },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
