"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ADMIN_THEME_STORAGE_KEY,
  LIGHT_THEME_CLASS,
  THEME_CHANGE_EVENT,
} from "@/lib/theme";

/*
 * Admin dark/light toggle.
 *
 * Deliberately mirrors `components/site/theme-toggle.tsx` — both read and write
 * the SAME `light` class on `<html>` and the same palette tokens, so there is a
 * single theme system, not two competing ones. The only difference is the
 * storage key: the dashboard keeps its own preference (see `lib/theme.ts`) so
 * restyling the control room never silently restyles the public showroom.
 *
 * Both icons are always rendered and swapped in CSS, because the active theme
 * is decided by an inline script before hydration. React state only shapes the
 * accessible label.
 */
function subscribeToTheme(onStoreChange: () => void) {
  document.documentElement.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  return () =>
    document.documentElement.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
}

function readIsLight() {
  return document.documentElement.classList.contains(LIGHT_THEME_CLASS);
}

function readIsLightOnServer() {
  return false;
}

function applyTheme(theme: "dark" | "light") {
  document.documentElement.classList.toggle(LIGHT_THEME_CLASS, theme === "light");
  document.documentElement.style.colorScheme = theme;
  try {
    window.localStorage.setItem(ADMIN_THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode); the class change still applies.
  }
  document.documentElement.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function AdminThemeToggle({ className }: { className?: string }) {
  const isLight = React.useSyncExternalStore(subscribeToTheme, readIsLight, readIsLightOnServer);
  const label = isLight ? "Switch the dashboard to dark mode" : "Switch the dashboard to light mode";

  return (
    <button
      type="button"
      onClick={() => applyTheme(isLight ? "dark" : "light")}
      title={label}
      aria-label={label}
      aria-pressed={isLight}
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-graphite-700 text-ink-300 transition-colors duration-200",
        "hover:border-gold-400/60 hover:bg-graphite-800/60 hover:text-gold-200",
        className
      )}
    >
      <Sun aria-hidden className="theme-dark-only size-5" />
      <Moon aria-hidden className="theme-light-only size-5" />
    </button>
  );
}
