"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

/**
 * Route-level error boundary for the public site.
 * Shows an actionable, non-technical message plus a working retry control.
 */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the technical detail for the operator; never render it to visitors.
    console.error("[site] route error:", error.message);
  }, [error]);

  return (
    <div className="container-page py-20">
      <Alert tone="error" title="Something went wrong">
        <p className="mb-4">
          We could not load this page. This is usually temporary — please retry.
        </p>
        <Button variant="outline" size="sm" onClick={reset}>
          <RefreshCw aria-hidden />
          Retry
        </Button>
      </Alert>
    </div>
  );
}
