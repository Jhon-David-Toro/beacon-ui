import type { ComponentsView } from './ComponentsView'

declare global {
  interface HTMLElementTagNameMap {
    'beacon-components': ComponentsView
  }
}
