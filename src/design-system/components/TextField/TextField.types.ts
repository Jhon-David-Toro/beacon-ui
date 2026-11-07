import type { BcTextField } from './TextField'
import type { TEXT_FIELD_TYPES } from './TextField.constants'

export type TextFieldType = (typeof TEXT_FIELD_TYPES)[number]

export type TextControl = HTMLInputElement | HTMLTextAreaElement

declare global {
  interface HTMLElementTagNameMap {
    'bc-text-field': BcTextField
  }
}
