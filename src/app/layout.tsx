import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeInitScript } from "@/components/site/theme-toggle";
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
  icons: {
    icon: "/truespec-logo-gold.png",
    shortcut: "/truespec-logo-gold.png",
    apple: "/truespec-logo-gold.png",
  },
};

/**
 * The browser chrome colours match the DARK palette. They live here rather than
 * following the runtime theme because Next renders them into static metadata;
 * the light theme is a client-side palette swap and the difference is a
 * progressive enhancement, not a correctness issue.
 */
export const viewport: Viewport = {
  themeColor: "#0b0d0f",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // `suppressHydrationWarning` is required because the inline script below
    // mutates <html> (class + color-scheme) before React hydrates.
    <html lang="en" className={`${inter.variable} ${oswald.variable}`} suppressHydrationWarning>
      <head>
        <ThemeInitScript />
      </head>
      <body className="min-h-dvh bg-background font-sans text-ink-100 antialiased">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
        <Toaster
          position="top-right"
          // Colours come from the active theme's palette so toasts stay legible
          // in both the dark and light showroom treatments.
          toastOptions={{
            style: {
              background: "var(--color-graphite-850)",
              border: "1px solid var(--color-graphite-700)",
              color: "var(--color-ink-100)",
            },
          }}
        />
      </body>
    </html>
  );
}
