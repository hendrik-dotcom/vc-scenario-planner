import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "VC Scenario Planner",
  description: "Portfolio scenario planning for early-stage VC investments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-[var(--background)]">
          <header className="border-b border-[var(--border)] px-6 py-4">
            <div className="max-w-7xl mx-auto">
              <a href="/" className="text-xl font-bold text-[var(--foreground)]">
                VC Scenario Planner
              </a>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
