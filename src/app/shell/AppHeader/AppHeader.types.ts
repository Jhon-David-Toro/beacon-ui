import type { RouteName } from '../../core/router'
import type { AppHeader } from './AppHeader'

export interface NavItem {
  readonly route: RouteName
  readonly label: string
  readonly path: string
}

declare global {
  interface HTMLElementTagNameMap {
    'beacon-header': AppHeader
  }
}
