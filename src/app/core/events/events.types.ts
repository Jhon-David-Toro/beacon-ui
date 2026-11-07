import type { ToastOptions } from '../../../design-system'

declare global {
  /** Types `addEventListener` for the app's own events. */
  interface HTMLElementEventMap {
    /** A view asks the shell to show a toast. */
    'beacon-notify': CustomEvent<ToastOptions>
  }
}
