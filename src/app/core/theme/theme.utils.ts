import { THEME_STORAGE_KEY, THEMES } from './theme.constants'
import type { Theme } from './theme.types'

/**
 * Whether a stored value is a known theme.
 *
 * @param value - Raw stored value.
 * @returns `true` for `light` or `dark`.
 */
export function isTheme(value: string | null): value is Theme {
  return value !== null && (THEMES as readonly string[]).includes(value)
}

/**
 * Theme to start with: the saved choice, or the operating system setting.
 *
 * @param stored - Value saved in localStorage.
 * @param prefersDark - Result of `prefers-color-scheme: dark`.
 * @returns The theme to apply.
 */
export function initialTheme(stored: string | null, prefersDark: boolean): Theme {
  if (isTheme(stored)) {
    return stored
  }

  return prefersDark ? 'dark' : 'light'
}

/**
 * Reads the saved theme without throwing where storage is blocked.
 *
 * @returns The stored value, or `null`.
 */
export function readStoredTheme(): string | null {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY)
  } catch {
    return null
  }
}

/**
 * Saves the theme, ignoring storage errors.
 *
 * @param theme - Theme to save.
 */
export function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // The choice still applies for this visit.
  }
}

/**
 * Applies a theme to the document.
 *
 * @param theme - Theme to apply.
 */
export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
}

/**
 * Runs a DOM change inside a view transition when the browser supports it
 * and the user has not asked for reduced motion.
 *
 * @param change - Function that updates the DOM.
 */
export function withViewTransition(change: () => void): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || !('startViewTransition' in document)) {
    change()

    return
  }
  document.startViewTransition(change)
}
