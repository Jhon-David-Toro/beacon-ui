import type { ComponentsView } from './ComponentsView'

declare global {
  /** Lets `querySelector('beacon-components')` return the right type. */
  interface HTMLElementTagNameMap {
    /** Living style guide page. */
    'beacon-components': ComponentsView
  }
}
