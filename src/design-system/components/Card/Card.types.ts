import type { BcCard } from './Card'
import type { CARD_PADDINGS } from './Card.constants'

export type CardPadding = (typeof CARD_PADDINGS)[number]

declare global {
  interface HTMLElementTagNameMap {
    'bc-card': BcCard
  }
}
