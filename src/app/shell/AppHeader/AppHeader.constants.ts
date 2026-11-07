import type { NavItem } from './AppHeader.types'

export const APP_HEADER_TAG = 'beacon-header'

export const NAV_ITEMS: readonly NavItem[] = [
  { route: 'overview', label: 'Overview', path: '/' },
  { route: 'components', label: 'Components', path: '/components' },
]
