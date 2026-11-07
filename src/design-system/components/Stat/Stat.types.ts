import type { BcStat } from './Stat'

declare global {
  /** Lets `querySelector('bc-stat')` return the right type. */
  interface HTMLElementTagNameMap {
    /** A single labelled figure. */
    'bc-stat': BcStat
  }
}
