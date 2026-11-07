import type { ROUTE_NAMES } from './router.constants'

/** Name of a route. */
export type RouteName = (typeof ROUTE_NAMES)[number]

/** One entry of the route table. */
export interface RouteDefinition {
  /** Route name, used to pick the view. */
  readonly name: RouteName

  /** Path pattern, such as `/services/:id`. */
  readonly pattern: string

  /** Page name for the document title. */
  readonly title: string
}

/** The route the app is on. */
export interface Route {
  /** Matched route name, or `not-found`. */
  readonly name: RouteName

  /** Decoded `:param` values from the path. */
  readonly params: Readonly<Record<string, string>>

  /** Query string after the path, such as `?service=search`. */
  readonly query: URLSearchParams
}
