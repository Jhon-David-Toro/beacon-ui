import type { BcIcon } from './Icon'
import type { ICON_PATHS } from './Icon.constants'

export type IconName = keyof typeof ICON_PATHS

declare global {
  interface HTMLElementTagNameMap {
    'bc-icon': BcIcon
  }
}
