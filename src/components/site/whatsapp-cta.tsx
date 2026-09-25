"use client";

import * as React from "react";
import { MessageCircle, TriangleAlert } from "lucide-react";
import { ButtonLink, type ButtonLinkProps } from "@/components/ui/button";
import { buildWhatsappLink } from "@/lib/whatsapp";

export interface WhatsappCtaProps extends Omit<ButtonLinkProps, "href" | "children"> {
  whatsappNumber: string;
  message: string;
  label?: string;
}

/**
 * WhatsApp call-to-action.
 *
 * - When a valid business number is configured it renders a real wa.me deep
 *   link with a correctly URL-encoded pre-filled message, opening in a new tab
 *   with rel="noopener noreferrer".
 * - When the number is missing or still the development placeholder it does NOT
 *   navigate to a broken/misleading link. Instead it reveals a clear
 *   development-state notice telling the operator how to configure the number.
 */
export function WhatsappCta({
  whatsappNumber,
  message,
  label = "Chat on WhatsApp",
  variant = "whatsapp",
  ...rest
}: WhatsappCtaProps) {
  const [showNotice, setShowNotice] = React.useState(false);
  const link = buildWhatsappLink(whatsappNumber, message);

  if (!link.href || link.isPlaceholder) {
    return (
      <>
        <ButtonLink
          {...rest}
          variant={variant}
          href="#whatsapp-unavailable"
          role="button"
          onClick={(e) => {
            e.preventDefault();
            setShowNotice(true);
          }}
          aria-describedby={showNotice ? "whatsapp-notice" : undefined}
        >
          <MessageCircle aria-hidden />
          {label}
        </ButtonLink>
        {showNotice ? (
          <div
            id="whatsapp-notice"
            role="status"
            className="mt-2 flex max-w-sm items-start gap-2 rounded-md border border-status-onorder/40 bg-status-onorder/10 px-3 py-2 text-xs text-ink-100"
          >
            <TriangleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0 text-status-onorder" />
            <span>
              <strong className="font-semibold">WhatsApp not configured.</strong> The business
              number is still a development placeholder. An administrator can set the real number
              in <span className="font-medium">Admin → Settings</span>.
            </span>
          </div>
        ) : null}
      </>
    );
  }

  return (
    <ButtonLink
      {...rest}
      variant={variant}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <MessageCircle aria-hidden />
      {label}
    </ButtonLink>
  );
}
