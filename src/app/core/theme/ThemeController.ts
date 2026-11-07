import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type { Theme } from './theme.types'
import {
  applyTheme,
  initialTheme,
  readStoredTheme,
  storeTheme,
  withViewTransition,
} from './theme.utils'

/**
 * Owns the light/dark theme. The inline script in `index.html` applies the
 * same choice before first paint, so this controller never causes a flash.
 */
export class ThemeController implements ReactiveController {
  /** Theme in use. */
  theme: Theme

  /** Element that renders the toggle. */
  readonly #host: ReactiveControllerHost

  /**
   * Picks the saved or system theme and attaches to the host.
   *
   * @param host - Element that renders the toggle.
   */
  constructor(host: ReactiveControllerHost) {
    this.#host = host
    this.theme = initialTheme(
      readStoredTheme(),
      window.matchMedia('(prefers-color-scheme: dark)').matches,
    )
    host.addController(this)
  }

  /** Applies the theme when the host connects. */
  hostConnected(): void {
    applyTheme(this.theme)
  }

  /** Switches between light and dark and remembers the choice. */
  toggle(): void {
    const next: Theme = this.theme === 'dark' ? 'light' : 'dark'
    withViewTransition(() => {
      applyTheme(next)
    })
    storeTheme(next)
    this.theme = next
    this.#host.requestUpdate()
  }
}
