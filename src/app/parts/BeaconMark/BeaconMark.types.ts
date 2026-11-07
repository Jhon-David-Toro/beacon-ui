import type { BeaconMark } from './BeaconMark'

declare global {
  /** Lets `querySelector('beacon-mark')` return the right type. */
  interface HTMLElementTagNameMap {
    /** The Beacon logo. */
    'beacon-mark': BeaconMark
  }
}
