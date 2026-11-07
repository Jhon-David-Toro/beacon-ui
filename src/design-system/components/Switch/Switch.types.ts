import type { BcSwitch } from './Switch'

declare global {
  /** Lets `querySelector('bc-switch')` return the right type. */
  interface HTMLElementTagNameMap {
    /** On/off control. */
    'bc-switch': BcSwitch
  }
}
