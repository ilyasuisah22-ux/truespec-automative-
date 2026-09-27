import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { TalkToUs } from "@/components/site/talk-to-us";
import { getPublicSettings } from "@/lib/data/public";
import { normaliseWhatsappNumber, IS_PLACEHOLDER_NUMBER } from "@/lib/whatsapp";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getPublicSettings();
  const number = normaliseWhatsappNumber(settings.whatsapp_number);
  const whatsappConfigured = Boolean(number) && !IS_PLACEHOLDER_NUMBER(number);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader whatsappNumber={settings.whatsapp_number} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter
        whatsappNumber={settings.whatsapp_number}
        whatsappConfigured={whatsappConfigured}
      />
      <TalkToUs whatsappNumber={settings.whatsapp_number} />
    </div>
  );
}
