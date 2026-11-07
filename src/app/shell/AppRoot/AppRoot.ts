import { ContextProvider } from '@lit/context'
import { LitElement, html, unsafeCSS } from 'lit'
import type { BcToastRegion, ToastOptions } from '../../../design-system'
import { defineElement } from '../../../design-system/shared'
import { NOTIFY_EVENT } from '../../core/events'
import { Router } from '../../core/router'
import type { Route } from '../../core/router'
import { IncidentStore, incidentStoreContext } from '../../core/store'
import '../../views/ComponentsView'
import '../../views/NotFoundView'
import '../../views/OverviewView'
import '../../views/ReportView'
import '../../views/ServiceView'
import '../AppHeader'
import { APP_ROOT_TAG } from './AppRoot.constants'
import styles from './AppRoot.scss?inline'
import { documentTitle } from './AppRoot.utils'

/**
 * Application shell. It owns the router and the incident store, provides
 * the store to every view through context, and turns `beacon-notify`
 * events into toasts.
 *
 * @tag beacon-app
 */
export class AppRoot extends LitElement {
  static override styles = unsafeCSS(styles)

  readonly #router = new Router(this, (route) => {
    this.#afterNavigation(route)
  })

  constructor(store: IncidentStore = new IncidentStore()) {
    super()
    new ContextProvider(this, { context: incidentStoreContext, initialValue: store })
    this.addEventListener(NOTIFY_EVENT, this.#handleNotify)
  }

  override connectedCallback(): void {
    super.connectedCallback()
    document.title = documentTitle(this.#router.route.name)
  }

  override render() {
    return html`<beacon-header route=${this.#router.route.name}></beacon-header>
      <main id="main" tabindex="-1">${this.#renderView(this.#router.route)}</main>
      <footer>
        Beacon UI: Web Components with Lit. Sample data, refreshed on every visit.
        <a href="https://github.com/Jhon-David-Toro/beacon-ui">Source on GitHub</a>
      </footer>
      <bc-toast-region></bc-toast-region>`
  }

  /**
   * View element for a route.
   *
   * @param route - Current route.
   */
  #renderView(route: Route) {
    switch (route.name) {
      case 'overview':
        return html`<beacon-overview></beacon-overview>`
      case 'service':
        return html`<beacon-service service-id=${route.params.id ?? ''}></beacon-service>`
      case 'report':
        return html`<beacon-report service-id=${route.query.get('service') ?? ''}></beacon-report>`
      case 'components':
        return html`<beacon-components></beacon-components>`
      case 'not-found':
        return html`<beacon-not-found></beacon-not-found>`
    }
  }

  /**
   * Updates the title and moves focus to the new page, so screen reader and
   * keyboard users start reading the new content instead of staying on the
   * link they clicked.
   *
   * @param route - Route just navigated to.
   */
  #afterNavigation(route: Route): void {
    document.title = documentTitle(route.name)
    void this.updateComplete.then(() => {
      this.renderRoot.querySelector('main')?.focus({ preventScroll: true })
      window.scrollTo({ top: 0 })
    })
  }

  /** Shows the toast a view asked for. */
  readonly #handleNotify = (event: CustomEvent<ToastOptions>): void => {
    this.renderRoot.querySelector<BcToastRegion>('bc-toast-region')?.show(event.detail)
  }
}

defineElement(APP_ROOT_TAG, AppRoot)
