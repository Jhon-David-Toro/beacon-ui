import { ROUTES } from './router.constants'
import type { Route, RouteDefinition } from './router.types'

/**
 * Splits a hash such as `#/services/search?tab=1` into path and query.
 *
 * @param hash - `location.hash`, with or without the leading `#`.
 * @returns The normalised path and the parsed query.
 */
export function parseHash(hash: string): { path: string; query: URLSearchParams } {
  const raw = hash.replace(/^#/, '') || '/'
  const [path = '/', search = ''] = raw.split('?')

  return { path: normalisePath(path), query: new URLSearchParams(search) }
}

/**
 * Removes a trailing slash so `/report/` and `/report` match the same route.
 *
 * @param path - URL path.
 * @returns The path with one leading slash and no trailing slash.
 */
export function normalisePath(path: string): string {
  const withSlash = path.startsWith('/') ? path : `/${path}`

  return withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : withSlash
}

/**
 * Matches a path against a pattern with `:param` segments.
 *
 * @param pattern - Route pattern, e.g. `/services/:id`.
 * @param path - Normalised path.
 * @returns The decoded params, or `null` when the path does not match.
 */
export function matchPattern(pattern: string, path: string): Record<string, string> | null {
  const expected = pattern.split('/')
  const actual = path.split('/')
  if (expected.length !== actual.length) {
    return null
  }
  const params: Record<string, string> = {}
  for (const [index, segment] of expected.entries()) {
    const value = actual[index] ?? ''
    if (segment.startsWith(':')) {
      params[segment.slice(1)] = decodeURIComponent(value)
    } else if (segment !== value) {
      return null
    }
  }

  return params
}

/**
 * Resolves a hash to a route, falling back to `not-found`.
 *
 * @param hash - `location.hash`.
 * @param routes - Route table.
 * @returns The matched route, or `not-found`.
 */
export function resolveRoute(hash: string, routes: readonly RouteDefinition[] = ROUTES): Route {
  const { path, query } = parseHash(hash)
  for (const route of routes) {
    const params = matchPattern(route.pattern, path)
    if (params) {
      return { name: route.name, params, query }
    }
  }

  return { name: 'not-found', params: {}, query }
}

/**
 * Builds an href for the hash router.
 *
 * @param path - App path, e.g. `/services/search`.
 * @param query - Optional query parameters.
 * @returns A hash link such as `#/report?service=auth`.
 */
export function href(path: string, query?: Record<string, string>): string {
  const search = query ? `?${new URLSearchParams(query).toString()}` : ''

  return `#${path}${search}`
}
