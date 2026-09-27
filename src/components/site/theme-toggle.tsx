"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LIGHT_THEME_CLASS,
  THEME_CHANGE_EVENT,
  THEME_INIT_SCRIPT,
  THEME_STORAGE_KEY,
} from "@/lib/theme";

/*
 * The active theme lives on `<html>` rather than in React state — the inline
 * bootstrap script sets it before hydration, and the toggle writes it directly
 * so no network/render work is needed to repaint the page. These functions let
 * `useSyncExternalStore` treat that DOM class as a real external store:
 *
 *  - `getServerSnapshot` returns false because the server cannot know the
 *    visitor's stored choice (and rendering is theme-independent anyway, since
 *    both logo lockups ship in the markup).
 *  - `subscribe` listens for `THEME_CHANGE_EVENT` so the accessible label
 *    updates in step with the class.
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
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode); the class change still applies.
  }
  document.documentElement.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

/**
 * Dark / light theme toggle.
 *
 * Both icons are always rendered and swapped purely in CSS via the same
 * `.theme-dark-only` / `.theme-light-only` helpers the logo lockups use. That
 * matters because the active theme is decided by an inline script before
 * hydration — rendering the icon from React state would either flash the wrong
 * glyph or risk a hydration mismatch. React state here only shapes the
 * accessible label.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const isLight = React.useSyncExternalStore(subscribeToTheme, readIsLight, readIsLightOnServer);
  const label = isLight ? "Switch to the dark showroom theme" : "Switch to the light showroom theme";

  return (
    <button
      type="button"
      onClick={() => applyTheme(isLight ? "dark" : "light")}
      title={label}
      aria-label={label}
      aria-pressed={isLight}
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-graphite-700 text-ink-300 transition-colors duration-200",
        "hover:border-gold-400/60 hover:bg-graphite-800/60 hover:text-gold-200",
        className
      )}
    >
      <Sun aria-hidden className="theme-dark-only size-5" />
      <Moon aria-hidden className="theme-light-only size-5" />
    </button>
  );
}

/** Inlined bootstrap that prevents a flash of the wrong theme. */
export function ThemeInitScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />;
}

