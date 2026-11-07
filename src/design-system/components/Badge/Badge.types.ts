import type { BcBadge } from './Badge'
import type { BADGE_TONES } from './Badge.constants'

export type BadgeTone = (typeof BADGE_TONES)[number]

declare global {
  interface HTMLElementTagNameMap {
    'bc-badge': BcBadge
  }
}
