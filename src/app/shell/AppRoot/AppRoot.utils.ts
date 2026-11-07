import { APP_TITLE, ROUTES } from '../../core/router'
import type { RouteName } from '../../core/router'

/**
 * Document title for a route, e.g. "Report an incident · Beacon".
 *
 * @param route - Current route.
 * @param detail - More specific page name, such as a service name.
 */
export function documentTitle(route: RouteName, detail?: string): string {
  const page = detail ?? ROUTES.find((definition) => definition.name === route)?.title
  return page && route !== 'overview' ? `${page} – ${APP_TITLE}` : `${APP_TITLE} – Service status`
}
