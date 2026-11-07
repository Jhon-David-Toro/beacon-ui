import type { ToastOptions } from '../../../design-system'

declare global {
  interface HTMLElementEventMap {
    'beacon-notify': CustomEvent<ToastOptions>
  }
}
