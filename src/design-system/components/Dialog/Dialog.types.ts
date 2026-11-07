import type { BcDialog } from './Dialog'

declare global {
  /** Lets `querySelector('bc-dialog')` return the right type. */
  interface HTMLElementTagNameMap {
    /** Modal dialog on the native `<dialog>` element. */
    'bc-dialog': BcDialog
  }

  /** Types `addEventListener` for the dialog events. */
  interface HTMLElementEventMap {
    /** The dialog closed. */
    'bc-close': Event
  }
}
