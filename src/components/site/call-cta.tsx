"use client";

import * as React from "react";
import { Phone, TriangleAlert } from "lucide-react";
import { ButtonLink, type ButtonLinkProps } from "@/components/ui/button";
import { buildCallLink } from "@/lib/whatsapp";

export interface CallCtaProps extends Omit<ButtonLinkProps, "href" | "children"> {
  /** Raw business number from public settings (WhatsApp line doubles as the phone line). */
  phoneNumber: string;
  /** Optional context appended to the accessible name, e.g. the vehicle title. */
  subject?: string;
  label?: string;
}

/**
 * "Call us" call-to-action.
 *
 * Mirrors `WhatsappCta`: when the configured number is still the development
 * placeholder we do NOT render a `tel:` link, because tapping it would either
 * fail silently or dial an unrelated number. Instead the button explains how an
 * administrator can configure the real line.
 */
export function CallCta({ phoneNumber, subject, label, variant = "outline", ...rest }: CallCtaProps) {
  const [showNotice, setShowNotice] = React.useState(false);
  const call = buildCallLink(phoneNumber);
  const resolvedLabel = label ?? (call.display ? `Call ${call.display}` : "Call us");
  const accessibleName = subject ? `${resolvedLabel} about the ${subject}` : resolvedLabel;

  if (!call.href) {
    return (
      <>
        <ButtonLink
          {...rest}
          variant={variant}
          href="#call-unavailable"
          role="button"
          aria-label={accessibleName}
          onClick={(e) => {
            e.preventDefault();
            setShowNotice(true);
          }}
          aria-describedby={showNotice ? "call-notice" : undefined}
        >
          <Phone aria-hidden />
          {resolvedLabel}
        </ButtonLink>
        {showNotice ? (
          <div
            id="call-notice"
            role="status"
            className="mt-2 flex max-w-sm items-start gap-2 rounded-md border border-status-onorder/40 bg-status-onorder/10 px-3 py-2 text-xs text-ink-100"
          >
            <TriangleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0 text-status-onorder" />
            <span>
              <strong className="font-semibold">Phone line not configured.</strong> The business
              number is still a development placeholder. An administrator can set the real number in{" "}
              <span className="font-medium">Admin → Settings</span>.
            </span>
          </div>
        ) : null}
      </>
    );
  }

  return (
    <ButtonLink {...rest} variant={variant} href={call.href} aria-label={accessibleName}>
      <Phone aria-hidden />
      {resolvedLabel}
    </ButtonLink>
  );
}
