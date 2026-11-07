import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type { Route } from './router.types'
import { resolveRoute } from './router.utils'

/**
 * Hash-based router as a Lit reactive controller. Hash routing needs no
 * server rewrites, so the build works as-is on GitHub Pages or any CDN.
 */
export class Router implements ReactiveController {
  route: Route

  readonly #host: ReactiveControllerHost
  readonly #onChange: (route: Route) => void

  /**
   * @param host - Element that re-renders on navigation.
   * @param onChange - Called after every navigation, e.g. to move focus.
   */
  constructor(host: ReactiveControllerHost, onChange: (route: Route) => void = () => undefined) {
    this.#host = host
    this.#onChange = onChange
    this.route = resolveRoute(location.hash)
    host.addController(this)
  }

  hostConnected(): void {
    window.addEventListener('hashchange', this.#handleHashChange)
  }

  hostDisconnected(): void {
    window.removeEventListener('hashchange', this.#handleHashChange)
  }

  /**
   * Navigates to an app path.
   *
   * @param target - Href produced by `href()`.
   */
  navigate(target: string): void {
    location.hash = target.replace(/^#/, '')
  }

  /** Re-resolves the route and asks the host to render it. */
  readonly #handleHashChange = (): void => {
    this.route = resolveRoute(location.hash)
    this.#host.requestUpdate()
    this.#onChange(this.route)
  }
}
