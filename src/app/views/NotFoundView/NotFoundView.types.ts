import type { NotFoundView } from './NotFoundView'

declare global {
  interface HTMLElementTagNameMap {
    'beacon-not-found': NotFoundView
  }
}
