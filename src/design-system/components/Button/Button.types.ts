import type { BUTTON_SIZES, BUTTON_TYPES, BUTTON_VARIANTS } from './Button.constants'
import type { BcButton } from './Button'

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number]
export type ButtonSize = (typeof BUTTON_SIZES)[number]
export type ButtonType = (typeof BUTTON_TYPES)[number]

declare global {
  interface HTMLElementTagNameMap {
    'bc-button': BcButton
  }
}
