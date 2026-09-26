import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { BrandMark } from "@/components/site/brand-mark";
import { LoginForm } from "@/components/admin/login-form";
import { isSupabaseConfigured } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Owner sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  const configured = isSupabaseConfigured();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-graphite-950 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <BrandMark />
          <p className="mt-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-ink-500">
            <Lock aria-hidden className="size-3.5" />
            Owner dashboard
          </p>
        </div>

        <div className="rounded-lg border border-graphite-700 bg-graphite-900 p-6 shadow-sm sm:p-8">
          <h1 className="font-display text-xl tracking-wide text-ink-50">Sign in</h1>
          <p className="mt-2 text-sm text-ink-400">
            Access is limited to authorised TrueSpec Automotive administrators.
          </p>

          <div className="mt-6 space-y-5">
            {!configured ? (
              <Alert tone="warning" title="Supabase not configured">
                Sign-in is disabled in this deployment because no Supabase project is connected.
                Configure <code className="text-gold-200">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                <code className="text-gold-200">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then create the
                owner account as described in the README.
              </Alert>
            ) : null}

            <LoginForm />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-ink-500">
          <Link href="/" className="hover:text-gold-200">
            ← Back to the public showroom
          </Link>
        </p>
      </div>
    </div>
  );
}
