import type { BadgeTone } from '../Badge/Badge.types'
import type { BcToastRegion } from './Toast'

/** What to show in a toast. */
export interface ToastOptions {
  /** Text of the toast, written as a short confirmation ("Incident reported."). */
  readonly message: string

  /** Colour of the edge. Defaults to `neutral`. */
  readonly tone?: BadgeTone

  /** Milliseconds before it disappears. Defaults to 5 seconds. */
  readonly duration?: number
}

/** A toast currently on screen. */
export interface ToastItem {
  /** Unique id, used to dismiss it. */
  readonly id: number

  /** Text of the toast. */
  readonly message: string

  /** Colour of the edge. */
  readonly tone: BadgeTone
}

declare global {
  /** Lets `querySelector('bc-toast-region')` return the right type. */
  interface HTMLElementTagNameMap {
    /** Live region for toasts. */
    'bc-toast-region': BcToastRegion
  }
}
