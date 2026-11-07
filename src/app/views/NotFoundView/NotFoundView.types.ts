import type { NotFoundView } from './NotFoundView'

declare global {
  /** Lets `querySelector('beacon-not-found')` return the right type. */
  interface HTMLElementTagNameMap {
    /** Page for unknown addresses. */
    'beacon-not-found': NotFoundView
  }
}
