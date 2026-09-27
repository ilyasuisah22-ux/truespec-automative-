"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/site/brand-mark";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { WhatsappCta } from "@/components/site/whatsapp-cta";
import { DEFAULT_GENERAL_MESSAGE } from "@/lib/whatsapp";

const NAV = [
  { href: "/inventory", label: "All Inventory" },
  { href: "/available", label: "Available" },
  { href: "/on-order", label: "On Order" },
  { href: "/landed", label: "Landed" },
] as const;

export function SiteHeader({ whatsappNumber }: { whatsappNumber: string }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  React.useEffect(() => {
    const timer = setTimeout(() => setOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-200",
        scrolled
          ? "border-graphite-800 bg-graphite-950/95 backdrop-blur supports-[backdrop-filter]:bg-graphite-950/90"
          : "border-graphite-800 bg-graphite-950/50"
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link
          href="/"
          className="rounded-sm flex-shrink-0"
          aria-label="TrueSpec Automotive — go to homepage"
        >
          <BrandMark size="lg" priority />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium tracking-wide transition-all duration-200",
                  active
                    ? "text-gold-400 before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:h-0.5 before:w-3/4 before:bg-gold-400 before:rounded-full"
                    : "text-ink-300 hover:text-ink-50 hover:bg-graphite-800/50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <div className="hidden sm:block">
            <WhatsappCta
              whatsappNumber={whatsappNumber}
              message={DEFAULT_GENERAL_MESSAGE}
              size="sm"
              label="WhatsApp"
              variant="whatsapp"
            />
          </div>

          <button
            type="button"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-md border transition-all duration-200 lg:hidden",
              open
                ? "border-gold-400/50 bg-graphite-900 text-gold-400"
                : "border-graphite-700 text-ink-100 hover:border-graphite-600 hover:bg-graphite-900/50"
            )}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className={cn(
          "border-t lg:hidden transition-all duration-300 ease-out",
          open ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden"
        )}
      >
        <div className="border-t border-graphite-800 bg-graphite-950">
          <nav aria-label="Mobile" className="container-page flex flex-col py-3">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-3.5 text-base transition-colors",
                    active
                      ? "bg-graphite-900 text-gold-400 font-medium"
                      : "text-ink-200 hover:bg-graphite-900/50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    {item.label}
                    {active && <ChevronDown aria-hidden className="size-4 text-gold-400" />}
                  </div>
                </Link>
              );
            })}
            <div className="pt-3 border-t border-graphite-800">
              <WhatsappCta
                whatsappNumber={whatsappNumber}
                message={DEFAULT_GENERAL_MESSAGE}
                className="w-full"
                label="Chat on WhatsApp"
                size="lg"
                variant="whatsapp"
              />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
