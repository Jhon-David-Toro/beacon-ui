import type { BcSkeleton } from './Skeleton'

declare global {
  /** Lets `querySelector('bc-skeleton')` return the right type. */
  interface HTMLElementTagNameMap {
    /** Loading placeholder. */
    'bc-skeleton': BcSkeleton
  }
}
