import type { RouteDefinition } from './router.types'

/** Name of every route, including the fallback. */
export const ROUTE_NAMES = ['overview', 'service', 'report', 'components', 'not-found'] as const

/** Route table, matched in order. Paths use `:param` segments. */
export const ROUTES: readonly RouteDefinition[] = [
  { name: 'overview', pattern: '/', title: 'Overview' },
  { name: 'service', pattern: '/services/:id', title: 'Service' },
  { name: 'report', pattern: '/report', title: 'Report an incident' },
  { name: 'components', pattern: '/components', title: 'Components' },
]

/** Product name, used in document titles. */
export const APP_TITLE = 'Beacon'
