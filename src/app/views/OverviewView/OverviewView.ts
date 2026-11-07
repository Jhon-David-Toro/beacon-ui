import { Task } from '@lit/task'
import { LitElement, html, unsafeCSS } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import '../../../design-system'
import type { BcSelect, BcTextField } from '../../../design-system'
import { defineElement } from '../../../design-system/shared'
import { headline } from '../../core/format'
import { StoreController } from '../../core/store'
import { openFirst, withReports } from '../../core/status'
import { fetchServices } from '../../data'
import type { Service } from '../../data'
import '../../parts/BeaconMark'
import '../../parts/IncidentList'
import '../../parts/ServiceRow'
import {
  ALL_STATUSES,
  OVERVIEW_VIEW_TAG,
  SKELETON_ROWS,
  STATUS_FILTER_OPTIONS,
} from './OverviewView.constants'
import styles from './OverviewView.scss?inline'
import { affectedCount, filterServices, overallStatus, summaryLine } from './OverviewView.utils'

/**
 * Landing page: one-sentence status, the 90-day horizon of every service,
 * a filterable service list and the incident timeline.
 *
 * @tag beacon-overview
 */
export class OverviewView extends LitElement {
  static override styles = unsafeCSS(styles)

  static override properties = {
    query: { state: true },
    status: { state: true },
  }

  declare private query: string
  declare private status: string

  readonly #store = new StoreController(this)

  readonly #services = new Task(this, {
    task: async (_args: [], { signal }) => fetchServices(signal),
    args: (): [] => [],
  })

  #checkedAt = new Date()

  constructor() {
    super()
    this.query = ''
    this.status = ALL_STATUSES
  }

  override render() {
    return html`<div class="container">
      ${this.#services.render({
        pending: () => this.#renderLoading(),
        complete: (services) => this.#renderLoaded(this.#withReports(services)),
        error: () => this.#renderError(),
      })}
    </div>`
  }

  /**
   * Services with this browser's reports merged in.
   *
   * @param services - Services from the API.
   */
  #withReports(services: readonly Service[]): Service[] {
    const store = this.#store.store
    return services.map((service) => withReports(service, store?.forService(service.id) ?? []))
  }

  /** Placeholder while the first request is in flight. */
  #renderLoading() {
    return html`<section class="hero" aria-busy="true">
        <h1>Checking every service…</h1>
      </section>
      <ul class="list" aria-label="Loading services">
        ${Array.from(
          { length: SKELETON_ROWS },
          () =>
            html`<li class="skeleton-row">
              <bc-skeleton></bc-skeleton><bc-skeleton></bc-skeleton>
            </li>`,
        )}
      </ul>`
  }

  /** Message and retry button when loading fails. */
  #renderError() {
    return html`<div class="error" role="alert">
      <h1>Service status could not be loaded.</h1>
      <p>The status API did not answer. Check your connection, then try again.</p>
      <bc-button variant="primary" @click=${this.#retry}>Try again</bc-button>
    </div>`
  }

  /**
   * Full page once services have loaded.
   *
   * @param services - Services with reports merged in.
   */
  #renderLoaded(services: readonly Service[]) {
    return html`${this.#renderHero(services)} ${this.#renderServices(services)}
      <section aria-labelledby="incidents-title">
        <div class="section-head"><h2 id="incidents-title">Incidents</h2></div>
        <beacon-incident-list
          .incidents=${openFirst(services.flatMap((service) => service.incidents))}
          .serviceNames=${new Map(services.map((service) => [service.id, service.name]))}
          empty="No incidents in the last 90 days."
          @beacon-resolve=${this.#handleResolve}
        ></beacon-incident-list>
      </section>`
  }

  /**
   * Headline and uptime horizon.
   *
   * @param services - Services with reports merged in.
   */
  #renderHero(services: readonly Service[]) {
    return html`<section class="hero" aria-labelledby="headline">
      <div class="headline">
        <beacon-mark status=${overallStatus(services)} signal></beacon-mark>
        <h1 id="headline">${headline(affectedCount(services))}</h1>
      </div>
      <p class="summary">${summaryLine(services, this.#checkedAt)}</p>
      <dl class="horizon" aria-label="Uptime, last 90 days">
        ${repeat(
          services,
          (service) => service.id,
          (service) =>
            html`<dt>${service.name}</dt>
              <dd>
                <bc-uptime-bar .days=${service.uptime} label=${service.name}></bc-uptime-bar>
              </dd>`,
        )}
        <div class="axis" aria-hidden="true"><span>90 days ago</span><span>Today</span></div>
      </dl>
    </section>`
  }

  /**
   * Filter controls and the service list.
   *
   * @param services - Services with reports merged in.
   */
  #renderServices(services: readonly Service[]) {
    const visible = filterServices(services, { query: this.query, status: this.status })
    return html`<section aria-labelledby="services-title">
      <div class="section-head">
        <h2 id="services-title">Services</h2>
        <div class="filters" role="search" aria-label="Filter services">
          <bc-text-field
            label="Find a service"
            type="search"
            placeholder="Name, feature or region"
            .value=${this.query}
            @input=${this.#handleQuery}
          ></bc-text-field>
          <bc-select
            label="Status"
            .options=${STATUS_FILTER_OPTIONS}
            .value=${this.status}
            @change=${this.#handleStatus}
          ></bc-select>
        </div>
      </div>
      <p class="count" role="status">Showing ${visible.length} of ${services.length} services</p>
      ${visible.length === 0 ? this.#renderEmpty() : this.#renderList(visible)}
    </section>`
  }

  /**
   * Rows for the visible services.
   *
   * @param services - Filtered services.
   */
  #renderList(services: readonly Service[]) {
    return html`<ul class="list">
      ${repeat(
        services,
        (service) => service.id,
        (service) => html`<li><beacon-service-row .service=${service}></beacon-service-row></li>`,
      )}
    </ul>`
  }

  /** Empty state when the filters hide everything. */
  #renderEmpty() {
    return html`<div class="list empty">
      <p>No service matches these filters.</p>
      <bc-button @click=${this.#clearFilters}>Clear filters</bc-button>
    </div>`
  }

  /** Updates the search text. */
  readonly #handleQuery = (event: Event): void => {
    this.query = (event.target as BcTextField).value
  }

  /** Updates the status filter. */
  readonly #handleStatus = (event: Event): void => {
    this.status = (event.target as BcSelect).value
  }

  /** Resets both filters. */
  readonly #clearFilters = (): void => {
    this.query = ''
    this.status = ALL_STATUSES
  }

  /** Loads the services again after an error. */
  readonly #retry = (): void => {
    this.#checkedAt = new Date()
    void this.#services.run()
  }

  /** Resolves an incident reported from this browser. */
  readonly #handleResolve = (event: CustomEvent<{ id: string }>): void => {
    this.#store.store?.resolve(event.detail.id)
  }
}

defineElement(OVERVIEW_VIEW_TAG, OverviewView)
