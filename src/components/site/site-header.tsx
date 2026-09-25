"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/site/brand-mark";
import { WhatsappCta } from "@/components/site/whatsapp-cta";
import { DEFAULT_GENERAL_MESSAGE } from "@/lib/whatsapp";

const NAV = [
  { href: "/inventory", label: "Inventory" },
  { href: "/available", label: "Available" },
  { href: "/on-order", label: "On Order" },
  { href: "/landed", label: "Landed" },
] as const;

export function SiteHeader({ whatsappNumber }: { whatsappNumber: string }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  // Close the mobile menu whenever the route changes.
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-graphite-800 bg-graphite-950/95 backdrop-blur supports-[backdrop-filter]:bg-graphite-950/80">
      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link
          href="/"
          className="rounded-sm"
          aria-label="TrueSpec Automotive — go to homepage"
        >
          <BrandMark />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-sm px-3 py-2 text-sm font-medium tracking-wide transition-colors",
                  active ? "text-gold-300" : "text-ink-200 hover:text-ink-50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <WhatsappCta
              whatsappNumber={whatsappNumber}
              message={DEFAULT_GENERAL_MESSAGE}
              size="sm"
              label="WhatsApp"
            />
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-graphite-700 text-ink-100 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden /> : <Menu aria-hidden />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-graphite-800 bg-graphite-950 lg:hidden"
      >
        <nav aria-label="Mobile" className="container-page flex flex-col py-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm px-2 py-3.5 text-base text-ink-100 hover:bg-graphite-900"
            >
              {item.label}
            </Link>
          ))}
          <div className="py-3">
            <WhatsappCta
              whatsappNumber={whatsappNumber}
              message={DEFAULT_GENERAL_MESSAGE}
              className="w-full"
              label="Chat on WhatsApp"
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
