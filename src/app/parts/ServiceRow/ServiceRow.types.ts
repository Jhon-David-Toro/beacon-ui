import type { ServiceRow } from './ServiceRow'

declare global {
  /** Lets `querySelector('beacon-service-row')` return the right type. */
  interface HTMLElementTagNameMap {
    /** One service in the overview list. */
    'beacon-service-row': ServiceRow
  }
}
