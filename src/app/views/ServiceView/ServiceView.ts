import { Task } from '@lit/task'
import { LitElement, html, unsafeCSS } from 'lit'
import '../../../design-system'
import { averageUptime, formatUptime } from '../../../design-system'
import type { BcDialog } from '../../../design-system'
import { defineElement } from '../../../design-system/shared'
import { notify } from '../../core/events'
import { STATUS_LABELS, STATUS_TONES, percentile, sparklineTone } from '../../core/format'
import { href } from '../../core/router'
import { isOpen, withReports } from '../../core/status'
import { StoreController } from '../../core/store'
import { LATENCY_SLO_MS, ServiceNotFoundError, fetchService } from '../../data'
import type { Service } from '../../data'
import '../../parts/IncidentList'
import { SERVICE_VIEW_TAG } from './ServiceView.constants'
import styles from './ServiceView.scss?inline'

/**
 * Detail page for one service: headline figures and tabs for latency,
 * uptime and incidents.
 *
 * @tag beacon-service
 */
export class ServiceView extends LitElement {
  /** Compiled styles, adopted by the shadow root. */
  static override styles = unsafeCSS(styles)

  /** Reactive properties; each one is documented on its field. */
  static override properties = {
    serviceId: { attribute: 'service-id' },
    pendingResolve: { state: true },
  }

  /**
   * Service id from the URL. Changing it loads the new service.
   *
   * @attr service-id
   * @default ''
   */
  declare serviceId: string

  /** Incident waiting for confirmation in the resolve dialog. */
  declare private pendingResolve: string | undefined

  /** Incidents reported from this browser. */
  readonly #store = new StoreController(this)

  /** Loads the service for `serviceId`; a new id aborts the previous request. */
  readonly #service = new Task(this, {
    task: async ([id]: [string], { signal }) => {
      const service = await fetchService(id, signal)
      document.title = `${service.name} – Beacon`

      return service
    },
    args: () => [this.serviceId] as [string],
  })

  /** Sets the defaults. */
  constructor() {
    super()
    this.serviceId = ''
    this.pendingResolve = undefined
  }

  /**
   * Renders the back link, the loading, error or loaded state, and the resolve dialog.
   *
   * @returns The page template.
   */
  override render() {
    return html`<div class="container">
      <a class="back" href=${href('/')}
        ><bc-icon name="arrowLeft" size="16"></bc-icon>All services</a
      >
      ${this.#service.render({
        pending: () =>
          html`<div class="loading" aria-busy="true" aria-label="Loading service">
            <bc-skeleton></bc-skeleton><bc-skeleton></bc-skeleton>
          </div>`,
        complete: (service) =>
          this.#renderService(
            withReports(service, this.#store.store?.forService(service.id) ?? []),
          ),
        error: (error) => this.#renderError(error),
      })}
      ${this.#renderResolveDialog()}
    </div>`
  }

  /**
   * Header, figures and tabs.
   *
   * @param service - Service with reports merged in.
   * @returns The header, figures and tabs.
   */
  #renderService(service: Service) {
    const open = service.incidents.filter(isOpen).length

    return html`<header>
        <div class="title-row">
          <h1>${service.name}</h1>
          <bc-badge tone=${STATUS_TONES[service.status]} ?pulse=${service.status === 'outage'}>
            ${STATUS_LABELS[service.status]}
          </bc-badge>
        </div>
        <p class="description">${service.description}</p>
      </header>
      <div class="stats">
        <bc-stat
          label="Uptime, 90 days"
          value=${formatUptime(averageUptime(service.uptime))}
        ></bc-stat>
        <bc-stat
          label="Median latency"
          value=${percentile(service.latency, 50)}
          unit="ms"
        ></bc-stat>
        <bc-stat label="p95 latency" value=${percentile(service.latency, 95)} unit="ms"></bc-stat>
        <bc-stat label="Open incidents" value=${open}></bc-stat>
      </div>
      <bc-tabs label="${service.name} details">
        <bc-tab-panel label="Latency">${this.#renderLatency(service)}</bc-tab-panel>
        <bc-tab-panel label="Uptime">${this.#renderUptime(service)}</bc-tab-panel>
        <bc-tab-panel label="Incidents (${service.incidents.length})">
          ${this.#renderIncidents(service)}
        </bc-tab-panel>
      </bc-tabs>`
  }

  /**
   * Latency chart with the SLO line.
   *
   * @param service - Service to chart.
   * @returns The latency panel content.
   */
  #renderLatency(service: Service) {
    return html`<div class="panel-head">
        <h2>Response time, last 24 hours</h2>
        <p>Dashed line: ${LATENCY_SLO_MS} ms target</p>
      </div>
      <div class="chart">
        <bc-sparkline
          .values=${service.latency}
          label="${service.name} latency, last 24 hours"
          unit="ms"
          tone=${sparklineTone(service.status)}
          threshold=${LATENCY_SLO_MS}
          width="800"
          height="220"
          area
        ></bc-sparkline>
        <div class="axis" aria-hidden="true"><span>24 hours ago</span><span>Now</span></div>
      </div>`
  }

  /**
   * Uptime bar and its legend.
   *
   * @param service - Service to chart.
   * @returns The uptime panel content.
   */
  #renderUptime(service: Service) {
    return html`<div class="panel-head"><h2>Daily uptime, last 90 days</h2></div>
      <bc-uptime-bar .days=${service.uptime} label=${service.name}></bc-uptime-bar>
      <ul class="legend" aria-label="Legend">
        <li><bc-badge tone="success">99.9% or more</bc-badge></li>
        <li><bc-badge tone="warning">99% to 99.9%</bc-badge></li>
        <li><bc-badge tone="danger">Under 99%</bc-badge></li>
      </ul>`
  }

  /**
   * Incident timeline and report button.
   *
   * @param service - Service whose incidents are listed.
   * @returns The incidents panel content.
   */
  #renderIncidents(service: Service) {
    return html`<div class="panel-head">
        <h2>Incident history</h2>
        <bc-button href=${href('/report', { service: service.id })}>
          <bc-icon name="plus" size="16"></bc-icon>Report incident
        </bc-button>
      </div>
      <beacon-incident-list
        .incidents=${service.incidents}
        empty="No incidents for ${service.name} in the last 90 days."
        @beacon-resolve=${this.#askToResolve}
      ></beacon-incident-list>`
  }

  /**
   * Not-found or generic failure message.
   *
   * @param error - Error thrown by the task.
   * @returns The error template.
   */
  #renderError(error: unknown) {
    if (error instanceof ServiceNotFoundError) {
      return html`<div class="error">
        <h1>There is no service called “${error.serviceId}”.</h1>
        <p>It may have been renamed. Pick it from the list of services instead.</p>
        <bc-button variant="primary" href=${href('/')}>See all services</bc-button>
      </div>`
    }

    return html`<div class="error" role="alert">
      <h1>This service could not be loaded.</h1>
      <p>The status API did not answer. Check your connection, then try again.</p>
      <bc-button variant="primary" @click=${this.#retry}>Try again</bc-button>
    </div>`
  }

  /**
   * Confirmation dialog for resolving a reported incident.
   *
   * @returns The dialog template.
   */
  #renderResolveDialog() {
    return html`<bc-dialog
      heading="Mark this incident resolved?"
      ?open=${this.pendingResolve !== undefined}
      @bc-close=${this.#cancelResolve}
    >
      It moves to the incident history and stops affecting the service status.
      <bc-button slot="footer" @click=${this.#cancelResolve}>Keep open</bc-button>
      <bc-button slot="footer" variant="primary" @click=${this.#confirmResolve}
        >Mark resolved</bc-button
      >
    </bc-dialog>`
  }

  /**
   * Opens the confirmation for the incident whose button was pressed.
   *
   * @param event - `beacon-resolve` event from the incident list.
   */
  readonly #askToResolve = (event: CustomEvent<{ id: string }>): void => {
    this.pendingResolve = event.detail.id
  }

  /** Closes the confirmation without changes. */
  readonly #cancelResolve = (): void => {
    this.pendingResolve = undefined
  }

  /** Resolves the incident and confirms it with a toast. */
  readonly #confirmResolve = (): void => {
    if (this.pendingResolve) {
      this.#store.store?.resolve(this.pendingResolve)
      notify(this, { message: 'Incident marked resolved.', tone: 'success' })
    }
    this.renderRoot.querySelector<BcDialog>('bc-dialog')?.close()
    this.pendingResolve = undefined
  }

  /** Loads the service again after an error. */
  readonly #retry = (): void => {
    void this.#service.run()
  }
}

defineElement(SERVICE_VIEW_TAG, ServiceView)
