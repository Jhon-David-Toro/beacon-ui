import type { NavItem } from './AppHeader.types'

/** Tag name of the header element. */
export const APP_HEADER_TAG = 'beacon-header'

/** Links of the main navigation, in order. */
export const NAV_ITEMS: readonly NavItem[] = [
  { route: 'overview', label: 'Overview', path: '/' },
  { route: 'components', label: 'Components', path: '/components' },
]
