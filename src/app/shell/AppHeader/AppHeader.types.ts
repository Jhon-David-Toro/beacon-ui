import type { RouteName } from '../../core/router'
import type { AppHeader } from './AppHeader'

/** One link of the main navigation. */
export interface NavItem {
  /** Route the link opens; marks the link as current while active. */
  readonly route: RouteName

  /** Link text. */
  readonly label: string

  /** App path, turned into a hash link. */
  readonly path: string
}

declare global {
  /** Lets `querySelector('beacon-header')` return the right type. */
  interface HTMLElementTagNameMap {
    /** Top bar of the app. */
    'beacon-header': AppHeader
  }
}
