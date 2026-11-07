import type { ROUTE_NAMES } from './router.constants'

export type RouteName = (typeof ROUTE_NAMES)[number]

export interface RouteDefinition {
  readonly name: RouteName
  readonly pattern: string
  readonly title: string
}

export interface Route {
  readonly name: RouteName
  readonly params: Readonly<Record<string, string>>
  readonly query: URLSearchParams
}
