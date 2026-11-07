import type { BcSelect } from './Select'

export interface SelectOption {
  readonly value: string
  readonly label: string
}

declare global {
  interface HTMLElementTagNameMap {
    'bc-select': BcSelect
  }
}
