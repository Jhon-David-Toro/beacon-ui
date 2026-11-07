import type { BadgeTone } from '../Badge/Badge.types'
import type { BcToastRegion } from './Toast'

export interface ToastOptions {
  readonly message: string
  readonly tone?: BadgeTone
  readonly duration?: number
}

export interface ToastItem {
  readonly id: number
  readonly message: string
  readonly tone: BadgeTone
}

declare global {
  interface HTMLElementTagNameMap {
    'bc-toast-region': BcToastRegion
  }
}
