"use client";

import * as React from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { buildCallLink, buildWhatsappLink, DEFAULT_GENERAL_MESSAGE } from "@/lib/whatsapp";

/**
 * Floating "Talk to Us" launcher.
 *
 * Deliberately duplicated from the header/footer CTAs: on long inventory pages
 * the enquiry action must stay reachable without scrolling back up.
 *
 * Behaviour
 *  - Collapsed by default to a single labelled button; expands into a panel.
 *  - Escape closes it and returns focus to the launcher.
 *  - When the business number is still the development placeholder both actions
 *    are disabled and the panel explains why, instead of offering dead links.
 *  - Hidden from print output.
 */
export function TalkToUs({
  whatsappNumber,
  className,
}: {
  whatsappNumber: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const panelId = React.useId();
  const launcherRef = React.useRef<HTMLButtonElement>(null);
  const firstActionRef = React.useRef<HTMLAnchorElement>(null);

  const whatsapp = buildWhatsappLink(whatsappNumber, DEFAULT_GENERAL_MESSAGE);
  const call = buildCallLink(whatsappNumber);
  const reachable = Boolean(whatsapp.href && !whatsapp.isPlaceholder);

  React.useEffect(() => {
    if (!open) return;
    firstActionRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className={cn("fixed bottom-5 right-5 z-40 print:hidden", className)}>
      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Talk to TrueSpec Automotive"
          className="mb-3 w-[min(20rem,calc(100vw-2.5rem))] overflow-hidden rounded-xl border border-graphite-700 bg-graphite-900 elevation-4"
        >
          <div className="flex items-start justify-between gap-3 border-b border-graphite-800 px-5 py-4">
            <div>
              <p className="font-display text-sm uppercase tracking-widest text-ink-50">
                Talk to us
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-400">
                Ask about a specific vehicle, request more photographs, or book an inspection.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                launcherRef.current?.focus();
              }}
              aria-label="Close the talk to us panel"
              className="rounded-md p-1.5 text-ink-400 transition-colors hover:bg-graphite-800 hover:text-ink-50"
            >
              <X aria-hidden className="size-4" />
            </button>
          </div>

          <div className="space-y-2.5 px-5 py-4">
            {reachable ? (
              <>
                <ButtonLink
                  ref={firstActionRef}
                  href={whatsapp.href as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  size="md"
                  className="w-full"
                >
                  <MessageCircle aria-hidden />
                  Chat on WhatsApp
                </ButtonLink>
                {call.href ? (
                  <ButtonLink href={call.href} variant="outline" size="md" className="w-full">
                    <Phone aria-hidden />
                    {call.display ? `Call ${call.display}` : "Call us"}
                  </ButtonLink>
                ) : null}
              </>
            ) : (
              <p
                role="status"
                className="rounded-md border border-status-onorder/40 bg-status-onorder/10 px-3 py-2 text-xs leading-relaxed text-ink-100"
              >
                <strong className="font-semibold">Contact details not configured.</strong> The
                business number is still a development placeholder. An administrator can set the real
                number in <span className="font-medium">Admin → Settings</span>.
              </p>
            )}

            <p className="text-[0.68rem] uppercase tracking-widest text-ink-500">
              Typical reply: within 1 business hour
            </p>
          </div>
        </div>
      ) : null}

      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? "Close the talk to us panel" : "Talk to us — open contact options"}
        className={cn(
          "ml-auto flex h-14 items-center gap-2.5 rounded-full px-5 font-medium shadow-lg transition-all duration-200",
          "bg-accent text-on-accent hover:bg-accent-hover hover:shadow-xl"
        )}
      >
        <MessageCircle aria-hidden className="size-5" />
        <span className="text-sm tracking-wide">Talk to us</span>
      </button>
    </div>
  );
}
