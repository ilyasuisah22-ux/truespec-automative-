"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CarFront,
  LayoutDashboard,
  Menu,
  PlusCircle,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/site/brand-mark";

/**
 * Admin navigation, grouped the way the dashboard is actually organised.
 *
 * Every entry here points at a route that EXISTS:
 *   /admin                    Overview          (dashboard)/page.tsx
 *   /admin/inventory          Inventory         (dashboard)/inventory/page.tsx
 *   /admin/inventory/new      Add vehicle       (dashboard)/inventory/new/page.tsx
 *   /admin/inventory/[id]     Vehicle detail    (dashboard)/inventory/[id]/page.tsx
 *                              -> reached from Inventory; images are managed there
 *   /admin/settings           Settings          (dashboard)/settings/page.tsx
 *
 * "Vehicle images" is deliberately NOT a separate nav item: images are managed
 * on each vehicle's own detail page, so linking to it directly would either be a
 * dead route or need an id the sidebar does not have.
 */
const GROUPS = [
  {
    heading: "Main",
    links: [{ href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true }],
  },
  {
    heading: "Inventory",
    links: [
      { href: "/admin/inventory", label: "Inventory", icon: CarFront, exact: false },
      { href: "/admin/inventory/new", label: "Add vehicle", icon: PlusCircle, exact: true },
    ],
  },
  {
    heading: "Admin",
    links: [{ href: "/admin/settings", label: "Settings", icon: Settings, exact: true }],
  },
] as const;

/** Whether a nav entry is the current page. */
function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  // `/admin/inventory/new` must not also light up the `/admin/inventory` entry,
  // so the parent only matches its own segment and its detail pages.
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** `true` when any link in the group is active, used to highlight the heading. */
function groupActive(pathname: string, group: (typeof GROUPS)[number]) {
  return group.links.some((l) => isActive(pathname, l.href, l.exact));
}

/** The navigation list, shared by the desktop rail and the mobile drawer. */
function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {GROUPS.map((group) => (
        <div key={group.heading} className="mb-6 last:mb-0">
          <p
            className={cn(
              "mb-2 px-3 text-[0.62rem] font-semibold uppercase tracking-[0.18em] transition-colors",
              groupActive(pathname, group) ? "text-gold-400/90" : "text-ink-500"
            )}
          >
            {group.heading}
          </p>
          <ul className="space-y-1">
            {group.links.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(pathname, href, exact);
              return (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                      active
                        ? "bg-gold-500/12 text-gold-200"
                        : "text-ink-400 hover:bg-graphite-850 hover:text-ink-50"
                    )}
                  >
                    {/* Gold rail marks the current section without shifting the row. */}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-gold-400 transition-opacity",
                        active ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <Icon
                      aria-hidden
                      className={cn(
                        "size-4 shrink-0 transition-colors",
                        active ? "text-gold-400" : "text-ink-500 group-hover:text-ink-300"
                      )}
                    />
                    <span className="truncate">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}
/**
 * The dashboard sidebar.
 *
 * - Desktop (`lg` and up): a fixed, always-visible rail.
 * - Below `lg`: the same navigation in a dismissible drawer, opened from the
 *   mobile header. The drawer is `position: fixed` and width-capped, so it can
 *   never widen the document and cause horizontal overflow.
 * - The rail is built from the SAME shared palette tokens as the rest of the
 *   site, so it reads correctly in both the dark and light dashboard themes,
 *   and the adaptive brand mark stays visible in both.
 */
export function AdminSidebar() {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);

  // Lock body scroll while the drawer is open, and close on Escape.
  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      {/* ---------------- Desktop rail ---------------- */}
      <aside className="hidden w-64 shrink-0 border-r border-graphite-800 bg-graphite-900/60 lg:block">
        <div className="sticky top-16 flex max-h-[calc(100dvh-4rem)] flex-col overflow-y-auto px-4 py-6">
          <nav aria-label="Dashboard">
            <NavList />
          </nav>
        </div>
      </aside>

      {/* ---------------- Mobile drawer ---------------- */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Scrim: clicking anywhere outside the panel closes the drawer. */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={close}
            className="absolute inset-0 h-full w-full cursor-default bg-scrim/70 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Dashboard navigation"
            className="absolute inset-y-0 left-0 flex w-[17rem] max-w-[85vw] flex-col overflow-y-auto border-r border-graphite-700 bg-graphite-900 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-graphite-800 px-4 py-3.5">
              <BrandMark surface="adaptive" size="sm" />
              <button
                type="button"
                onClick={close}
                aria-label="Close navigation"
                className="inline-flex size-9 items-center justify-center rounded-md border border-graphite-700 text-ink-300 transition-colors hover:border-gold-400/60 hover:text-gold-200"
              >
                <X aria-hidden className="size-4" />
              </button>
            </div>

            <div className="px-4 py-5">
              <nav aria-label="Dashboard">
                <NavList onNavigate={close} />
              </nav>
            </div>
          </div>
        </div>
      ) : null}

      {/* The button that opens the drawer lives in the mobile header, which the
          layout renders alongside this component. */}
      <MobileNavToggle open={open} onToggle={() => setOpen((v) => !v)} />
    </>
  );
}

/**
 * The hamburger trigger for the mobile drawer.
 *
 * Rendered here (rather than in the server layout) because it needs state. It is
 * `fixed` to the top-left on small screens so it lines up with the header, and
 * hidden from `lg` up where the permanent rail takes over.
 */
function MobileNavToggle({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-label={open ? "Close navigation" : "Open navigation"}
      className="fixed left-4 top-3 z-40 inline-flex size-10 items-center justify-center rounded-md border border-graphite-700 bg-graphite-900/95 text-ink-200 backdrop-blur transition-colors hover:border-gold-400/60 hover:text-gold-200 lg:hidden"
    >
      <Menu aria-hidden className="size-5" />
    </button>
  );
}

