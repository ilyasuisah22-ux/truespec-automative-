import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut, ShieldAlert, TriangleAlert } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button, ButtonLink } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { BrandMark } from "@/components/site/brand-mark";
import { requireAdmin, UnauthenticatedError, UnauthorizedError } from "@/lib/auth/require-admin";
import { signOutAction } from "@/lib/actions/auth";
import { isDemoMode } from "@/lib/data/public";

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
        <div className="flex min-h-dvh items-center justify-center px-4 py-16">
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

  return (
    <div className="flex min-h-dvh flex-col bg-graphite-950">
      <header className="border-b border-graphite-800 bg-graphite-900">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" aria-label="Dashboard home">
              <BrandMark />
            </Link>
            <span className="hidden h-8 w-px bg-graphite-700 sm:block" />
            <span className="hidden text-xs uppercase tracking-[0.24em] text-ink-500 sm:block">
              Owner dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-ink-400 sm:block">
              {session.user.email}
            </span>
            <form action={signOutAction}>
              <Button type="submit" variant="outline" size="sm">
                <LogOut aria-hidden />
                Sign out
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

      {demo ? (
        <div className="border-b border-status-onorder/40 bg-status-onorder/10">
          <div className="container-page flex items-start gap-2.5 py-3 text-xs text-ink-100">
            <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-status-onorder" />
            <p>
              <strong className="font-semibold">Demonstration data.</strong> Inventory and financial
              figures shown are illustrative sample records, not TrueSpec Automotive&apos;s real
              business data. Supabase is not connected in this deployment, so create, edit and
              delete are disabled — see the README to connect your project.
            </p>
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
