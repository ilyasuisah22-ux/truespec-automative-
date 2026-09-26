import type { Metadata } from "next";
import { Alert } from "@/components/ui/alert";
import { SettingsForm } from "@/components/admin/settings-form";
import { getPrivateSettings } from "@/lib/data/admin";
import { isDemoMode } from "@/lib/data/public";
import { koboToNaira } from "@/lib/money";
import { IS_PLACEHOLDER_NUMBER } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Settings", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  let settings;
  try {
    settings = await getPrivateSettings();
  } catch {
    return (
      <Alert tone="error" title="Could not load settings">
        The database did not respond. Reload the page, and if the problem continues verify your
        Supabase configuration.
      </Alert>
    );
  }

  const placeholderNumber = IS_PLACEHOLDER_NUMBER(settings.whatsapp_number);

  return (
    <div className="space-y-7">
      <header>
        <h1 className="font-display text-2xl tracking-wide text-ink-50 sm:text-3xl">Settings</h1>
        <p className="mt-2 text-sm text-ink-400">
          Business configuration for the public website and default financial assumptions.
        </p>
      </header>

      {placeholderNumber ? (
        <Alert tone="warning" title="The WhatsApp number is still a development placeholder">
          2340000000000 is not a real business number. Replace it with Umar&apos;s actual WhatsApp
          number below before showing the site to customers. Until then, WhatsApp buttons on the
          public site show a clear &ldquo;not configured&rdquo; notice instead of opening a broken
          link.
        </Alert>
      ) : null}

      <SettingsForm
        defaults={{
          whatsapp_number: settings.whatsapp_number,
          site_tagline: settings.site_tagline,
          default_full_tank_cost_naira: String(
            koboToNaira(settings.default_full_tank_cost_kobo)
          ),
        }}
        editable={!isDemoMode()}
      />
    </div>
  );
}
