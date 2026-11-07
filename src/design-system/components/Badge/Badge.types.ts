import type { BcBadge } from './Badge'
import type { BADGE_TONES } from './Badge.constants'

/** Colour family of a badge, toast or status indicator. */
export type BadgeTone = (typeof BADGE_TONES)[number]

declare global {
  /** Lets `querySelector('bc-badge')` return the right type. */
  interface HTMLElementTagNameMap {
    /** Short status label with a coloured dot. */
    'bc-badge': BcBadge
  }
}
