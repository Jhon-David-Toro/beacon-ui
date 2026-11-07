import type { ServiceView } from './ServiceView'

declare global {
  /** Lets `querySelector('beacon-service')` return the right type. */
  interface HTMLElementTagNameMap {
    /** Service detail page. */
    'beacon-service': ServiceView
  }
}
