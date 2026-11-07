import type { RouteDefinition } from './router.types'

export const ROUTE_NAMES = ['overview', 'service', 'report', 'components', 'not-found'] as const

export const ROUTES: readonly RouteDefinition[] = [
  { name: 'overview', pattern: '/', title: 'Overview' },
  { name: 'service', pattern: '/services/:id', title: 'Service' },
  { name: 'report', pattern: '/report', title: 'Report an incident' },
  { name: 'components', pattern: '/components', title: 'Components' },
]

export const APP_TITLE = 'Beacon'
