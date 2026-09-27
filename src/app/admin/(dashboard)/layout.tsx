import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut, ShieldAlert, TriangleAlert } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminThemeToggle } from "@/components/admin/admin-theme-toggle";
import { Button, ButtonLink } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { BrandMark } from "@/components/site/brand-mark";
import { requireAdmin, UnauthenticatedError, UnauthorizedError } from "@/lib/auth/require-admin";
import { signOutAction } from "@/lib/actions/auth";
import { isDemoMode, isShowroomUsingDemoInventory } from "@/lib/data/public";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Protected dashboard shell.
 *
 * Authentication AND authorization are enforced here on the SERVER before any
 * dashboard content renders. Hiding navigation links is never relied upon.
 * Each Server Action independently re-checks authorization too.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let session: { user: { email?: string | null } };

  try {
    session = await requireAdmin();
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      redirect("/admin/login");
    }
    if (error instanceof UnauthorizedError) {
      return (
        <div className="flex min-h-dvh items-center justify-center bg-graphite-950 px-4 py-16">
          <div className="w-full max-w-md rounded-lg border border-danger/40 bg-graphite-900 p-6">
            <Alert tone="error" title="Not authorised">
              <p className="mb-4">
                You are signed in, but this account is not on the TrueSpec Automotive
                administrator allow-list. Dashboard access is restricted to the business owner.
              </p>
            </Alert>
            <div className="mt-5 flex flex-wrap gap-3">
              <form action={signOutAction}>
                <Button type="submit" variant="outline">
                  <LogOut aria-hidden />
                  Sign out
                </Button>
              </form>
              <ButtonLink href="/" variant="ghost">
                Return to showroom
              </ButtonLink>
            </div>
          </div>
        </div>
      );
    }
    throw error;
  }

  const demo = isDemoMode();
  // True when the database is connected but still holds no vehicles, so the
  // dashboard is showing the prototype fleet rather than real listings. Editing
  // is still available in this state -- that is exactly how the owner replaces
  // the prototype records with real vehicles.
  const prototypeFleet = !demo && (await isShowroomUsingDemoInventory());

  return (
    // The dashboard uses the SHARED palette tokens, so it renders correctly in
    // both the dark operations theme and the light one. It is deliberately NOT
    // wrapped in `theme-force-dark` any more: the owner chooses via the header
    // toggle, and that choice is stored separately from the public showroom's
    // preference (see lib/theme.ts) so the two never interfere.
    <div className="flex min-h-dvh flex-col bg-graphite-950">
      <header className="sticky top-0 z-40 border-b border-graphite-800 bg-graphite-900/95 backdrop-blur supports-[backdrop-filter]:bg-graphite-900/85">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            {/* `adaptive` ships both official ink variants and swaps them with CSS,
                so the black lockup shows on the light dashboard header. Pinning
                the white lockup here would be invisible in light mode. */}
            <Link href="/admin" aria-label="Dashboard home" className="shrink-0 rounded-sm">
              <BrandMark surface="adaptive" />
            </Link>
            <span aria-hidden className="hidden h-7 w-px bg-graphite-700 sm:block" />
            <span className="hidden truncate text-xs uppercase tracking-[0.22em] text-ink-400 sm:block">
              Operations
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden max-w-[16ch] truncate text-xs text-ink-400 lg:block">
              {session.user.email}
            </span>
            <AdminThemeToggle />
            <form action={signOutAction}>
              <Button type="submit" variant="outline" size="sm">
                <LogOut aria-hidden />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-graphite-800">
          <div className="container-page py-2">
            <AdminNav />
          </div>
        </div>
      </header>

      {demo || prototypeFleet ? (
        <div className="border-b border-status-onorder/40 bg-status-onorder/10">
          <div className="container-page flex items-start gap-2.5 py-3 text-xs text-ink-100">
            <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-status-onorder" />
            {demo ? (
              <p>
                <strong className="font-semibold">Demonstration data.</strong> Inventory and
                financial figures shown are illustrative sample records, not TrueSpec
                Automotive&apos;s real business data. Supabase is not connected in this
                deployment, so create, edit and delete are disabled — see the README to
                connect your project.
              </p>
            ) : (
              <p>
                <strong className="font-semibold">Prototype inventory.</strong> Your database is
                connected but contains no vehicles yet, so the dashboard is showing the
                demonstration fleet. Add your first vehicle to replace it — the public showroom
                switches to real listings as soon as one exists.
              </p>
            )}
          </div>
        </div>
      ) : null}

      <main id="main" className="flex-1">
        <div className="container-page py-8 sm:py-10">{children}</div>
      </main>

      <footer className="border-t border-graphite-800 py-5">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 text-xs text-ink-500">
          <p className="flex items-center gap-1.5">
            <ShieldAlert aria-hidden className="size-3.5" />
            All dashboard operations are authorised server-side and logged.
          </p>
          <Link href="/" className="hover:text-gold-200">
            View public showroom →
          </Link>
        </div>
      </footer>
    </div>
  );
}
