import type { BcTextField } from './TextField'
import type { TEXT_FIELD_TYPES } from './TextField.constants'

/** Input type of a single-line text field. */
export type TextFieldType = (typeof TEXT_FIELD_TYPES)[number]

/** Native control rendered inside the text field. */
export type TextControl = HTMLInputElement | HTMLTextAreaElement

declare global {
  /** Lets `querySelector('bc-text-field')` return the right type. */
  interface HTMLElementTagNameMap {
    /** Labelled text input or textarea. */
    'bc-text-field': BcTextField
  }
}
