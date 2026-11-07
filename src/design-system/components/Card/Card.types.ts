import type { BcCard } from './Card'
import type { CARD_PADDINGS } from './Card.constants'

/** Inner spacing of a card. */
export type CardPadding = (typeof CARD_PADDINGS)[number]

declare global {
  /** Lets `querySelector('bc-card')` return the right type. */
  interface HTMLElementTagNameMap {
    /** Bordered surface for related content. */
    'bc-card': BcCard
  }
}
