"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CarFront, LayoutDashboard, PlusCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/inventory", label: "Inventory", icon: CarFront, exact: false },
  { href: "/admin/inventory/new", label: "Add vehicle", icon: PlusCircle, exact: true },
  { href: "/admin/settings", label: "Settings", icon: Settings, exact: true },
] as const;

export function AdminNav({ orientation = "horizontal" }: { orientation?: "horizontal" | "vertical" }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Dashboard"
      className={cn(
        orientation === "horizontal"
          ? "flex gap-1 overflow-x-auto"
          : "flex flex-col gap-1"
      )}
    >
      {LINKS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-graphite-800 text-gold-300"
                : "text-ink-300 hover:bg-graphite-850 hover:text-ink-50"
            )}
          >
            <Icon aria-hidden className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
