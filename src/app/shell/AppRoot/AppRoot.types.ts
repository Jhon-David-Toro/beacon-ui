import type { AppRoot } from './AppRoot'

declare global {
  interface HTMLElementTagNameMap {
    'beacon-app': AppRoot
  }
}
