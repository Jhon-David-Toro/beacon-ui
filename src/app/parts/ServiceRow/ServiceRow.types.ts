import type { ServiceRow } from './ServiceRow'

declare global {
  interface HTMLElementTagNameMap {
    'beacon-service-row': ServiceRow
  }
}
