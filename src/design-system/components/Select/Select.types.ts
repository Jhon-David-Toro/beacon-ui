import type { BcSelect } from './Select'

/** One choice in a `bc-select`. */
export interface SelectOption {
  /** Value submitted with the form when this option is picked. */
  readonly value: string

  /** Text the user sees. */
  readonly label: string
}

declare global {
  /** Lets `querySelector('bc-select')` return the right type. */
  interface HTMLElementTagNameMap {
    /** Labelled native select. */
    'bc-select': BcSelect
  }
}
