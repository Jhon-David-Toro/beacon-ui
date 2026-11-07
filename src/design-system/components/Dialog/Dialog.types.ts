import type { BcDialog } from './Dialog'

declare global {
  interface HTMLElementTagNameMap {
    'bc-dialog': BcDialog
  }

  interface HTMLElementEventMap {
    'bc-close': Event
  }
}
