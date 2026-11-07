import type { AppRoot } from './AppRoot'

declare global {
  /** Lets `querySelector('beacon-app')` return the right type. */
  interface HTMLElementTagNameMap {
    /** Application shell. */
    'beacon-app': AppRoot
  }
}
