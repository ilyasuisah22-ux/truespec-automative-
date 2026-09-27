/**
 * Theme plumbing shared by the server-rendered root layout and the client-side
 * toggle. Kept dependency-free (no React, no DOM APIs at module scope) so both
 * sides can import it safely.
 *
 * Implementation note: the active theme lives as a `light` class on `<html>`.
 * Because every Tailwind colour utility compiles to `var(--color-*)`, flipping
 * that one class re-points the whole palette (see `globals.css`). That keeps the
 * theme a *presentation* concern and means no component needs theme props.
 */
export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "truespec-theme";

/**
 * The dashboard keeps its OWN preference under a separate key.
 *
 * The owner may prefer a bright control room while leaving the public showroom
 * on the dark cinematic treatment (or the reverse). Sharing one key would make
 * every admin toggle silently restyle the customer-facing site, so the two are
 * stored independently. Both still resolve to the same `light` class on `<html>`
 * and the same palette tokens, so there is exactly one theme system.
 */
export const ADMIN_THEME_STORAGE_KEY = "truespec-admin-theme";

/** The dashboard defaults to the dark operations palette. */
export const DEFAULT_ADMIN_THEME: Theme = "dark";

/** Admin routes — the area that reads the admin preference. */
export const ADMIN_PATH_PREFIX = "/admin";

export function isAdminPath(pathname: string): boolean {
  return pathname === ADMIN_PATH_PREFIX || pathname.startsWith(`${ADMIN_PATH_PREFIX}/`);
}

/**
 * The showroom opens in its dark cinematic treatment. A visitor's explicit
 * choice is remembered in localStorage, but we deliberately do NOT follow
 * `prefers-color-scheme` by default — the graphite + gold look is the brand,
 * and the hero photography is graded for it.
 */
export const DEFAULT_THEME: Theme = "dark";

/** Class applied to `<html>` when the light palette is active. */
export const LIGHT_THEME_CLASS = "light";

/**
 * DOM event fired on `<html>` after the theme changes. `ThemeToggle` writes the
 * class directly to the document (that is the actual store of truth), so this
 * event is what lets `useSyncExternalStore` subscribers re-read it.
 */
export const THEME_CHANGE_EVENT = "truespec:theme-change";

export function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

/**
 * Blocking bootstrap script for `<head>`.
 *
 * It must run before the browser paints so a returning light-theme visitor
 * never sees a flash of the dark palette. Kept as a plain string so the layout
 * can inline it with `dangerouslySetInnerHTML`; the `try/catch` covers browsers
 * where `localStorage` throws (private mode, blocked cookies).
 */
export const THEME_INIT_SCRIPT = [
  "(function(){",
  "try{",
  `var p=window.location.pathname;`,
  `var isAdmin=(p===${JSON.stringify(ADMIN_PATH_PREFIX)}||p.indexOf(${JSON.stringify(ADMIN_PATH_PREFIX + "/")})===0);`,
  // Admin routes read their own stored preference; everything else reads the
  // showroom's. Resolved in ONE script so the first paint on either surface is
  // already correct and neither area flashes the other's theme.
  `var key=isAdmin?${JSON.stringify(ADMIN_THEME_STORAGE_KEY)}:${JSON.stringify(THEME_STORAGE_KEY)};`,
  `var fallback=isAdmin?${JSON.stringify(DEFAULT_ADMIN_THEME)}:${JSON.stringify(DEFAULT_THEME)};`,
  `var stored=localStorage.getItem(key);`,
  `var theme=(stored==="light"||stored==="dark")?stored:fallback;`,
  `if(theme==="light"){document.documentElement.classList.add(${JSON.stringify(LIGHT_THEME_CLASS)});}`,
  'document.documentElement.style.colorScheme=theme;',
  "}catch(e){}",
  "})();",
].join("");
