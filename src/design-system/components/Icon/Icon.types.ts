import type { BcIcon } from './Icon'
import type { ICON_PATHS } from './Icon.constants'

/** Name of an icon in the built-in set. */
export type IconName = keyof typeof ICON_PATHS

declare global {
  /** Lets `querySelector('bc-icon')` return the right type. */
  interface HTMLElementTagNameMap {
    /** Stroke icon from the built-in set. */
    'bc-icon': BcIcon
  }
}
