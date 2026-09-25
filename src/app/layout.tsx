import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: {
    default: "TrueSpec Automotive — Premium Vehicle Import",
    template: "%s | TrueSpec Automotive",
  },
  description:
    "Browse TrueSpec Automotive inventory — available, on order and landed vehicles, with transparent doorstep pricing and direct WhatsApp enquiry.",
  applicationName: "TrueSpec Automotive",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <body className="min-h-dvh bg-graphite-950 font-sans text-ink-100 antialiased">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#171b21",
              border: "1px solid #333a46",
              color: "#eceef1",
            },
          }}
        />
      </body>
    </html>
  );
}
