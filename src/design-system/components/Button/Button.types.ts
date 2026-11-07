import type { BcButton } from './Button'
import type { BUTTON_SIZES, BUTTON_TYPES, BUTTON_VARIANTS } from './Button.constants'

/** Visual emphasis of a button. */
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number]

/** Height of a button. */
export type ButtonSize = (typeof BUTTON_SIZES)[number]

/** What a button does inside a form. */
export type ButtonType = (typeof BUTTON_TYPES)[number]

declare global {
  /** Lets `querySelector('bc-button')` return the right type. */
  interface HTMLElementTagNameMap {
    /** Action button or link. */
    'bc-button': BcButton
  }
}
