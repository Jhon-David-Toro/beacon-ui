import type { ServiceView } from './ServiceView'

declare global {
  interface HTMLElementTagNameMap {
    'beacon-service': ServiceView
  }
}
