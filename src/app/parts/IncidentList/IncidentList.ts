import { LitElement, html, nothing, unsafeCSS } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import '../../../design-system'
import { defineElement } from '../../../design-system/shared'
import {
  PHASE_LABELS,
  STATUS_LABELS,
  STATUS_TONES,
  formatDateTime,
  formatRelative,
} from '../../core/format'
import { href } from '../../core/router'
import type { Incident } from '../../data'
import { INCIDENT_LIST_TAG, RESOLVE_EVENT } from './IncidentList.constants'
import { startedPrefix } from './IncidentList.utils'
import styles from './IncidentList.scss?inline'
import type { ResolveDetail } from './IncidentList.types'

/**
 * Timeline of incidents. Incidents reported from this browser get a
 * "Mark resolved" action that fires `beacon-resolve`.
 *
 * @tag beacon-incident-list
 * @fires beacon-resolve - When "Mark resolved" is pressed. `detail.id` is the incident.
 */
export class IncidentList extends LitElement {
  /** Compiled styles, adopted by the shadow root. */
  static override styles = unsafeCSS(styles)

  /** Reactive properties; each one is documented on its field. */
  static override properties = {
    incidents: { attribute: false },
    serviceNames: { attribute: false },
    empty: {},
  }

  /**
   * Incidents to list, in display order.
   *
   * @default []
   */
  declare incidents: readonly Incident[]

  /**
   * Service names by id. When set, each incident links to its service.
   *
   * @default undefined
   */
  declare serviceNames: ReadonlyMap<string, string> | undefined

  /**
   * Text shown when there are no incidents.
   *
   * @default 'No incidents.'
   */
  declare empty: string

  /** Sets the defaults. */
  constructor() {
    super()
    this.incidents = []
    this.serviceNames = undefined
    this.empty = 'No incidents.'
  }

  /**
   * Renders the timeline, or the empty text.
   *
   * @returns The list template.
   */
  override render() {
    if (this.incidents.length === 0) {
      return html`<p class="empty">${this.empty}</p>`
    }

    return html`<ol>
      ${repeat(
        this.incidents,
        (incident) => incident.id,
        (incident) => this.#renderIncident(incident),
      )}
    </ol>`
  }

  /**
   * One timeline entry.
   *
   * @param incident - Incident to render.
   * @returns The list item template.
   */
  #renderIncident(incident: Incident) {
    const resolved = incident.phase === 'resolved'

    return html`<li data-tone=${STATUS_TONES[incident.severity]} data-phase=${incident.phase}>
      <span class="node" aria-hidden="true"></span>
      <div class="heading">
        <h3>${incident.title}</h3>
        <bc-badge tone=${resolved ? 'neutral' : STATUS_TONES[incident.severity]}>
          ${resolved ? PHASE_LABELS.resolved : STATUS_LABELS[incident.severity]}
        </bc-badge>
      </div>
      <p class="meta">
        ${this.#renderService(incident)}${startedPrefix(incident)}
        <time datetime=${incident.startedAt} title=${formatDateTime(incident.startedAt)}
          >${formatRelative(incident.startedAt)}</time
        >${incident.reportedByYou ? ', reported by you' : ''}.
      </p>
      ${incident.details ? html`<p class="details">${incident.details}</p>` : nothing}
      ${incident.reportedByYou && !resolved ? this.#renderResolve(incident) : nothing}
    </li>`
  }

  /**
   * Link to the incident's service, when names are known.
   *
   * @param incident - Incident being rendered.
   * @returns The service link, or `nothing` without names.
   */
  #renderService(incident: Incident) {
    const name = this.serviceNames?.get(incident.serviceId)
    if (!name) {
      return nothing
    }

    return html`<a href=${href(`/services/${incident.serviceId}`)}>${name}</a>. `
  }

  /**
   * Resolve action for incidents reported from this browser.
   *
   * @param incident - Incident being rendered.
   * @returns The resolve button template.
   */
  #renderResolve(incident: Incident) {
    return html`<div class="actions">
      <bc-button size="s" data-id=${incident.id} @click=${this.#handleResolve}
        >Mark resolved</bc-button
      >
    </div>`
  }

  /**
   * Asks the owner to resolve the incident.
   *
   * @param event - Click on a "Mark resolved" button.
   */
  readonly #handleResolve = (event: Event): void => {
    const id = (event.currentTarget as HTMLElement).dataset.id ?? ''
    this.dispatchEvent(
      new CustomEvent<ResolveDetail>(RESOLVE_EVENT, {
        detail: { id },
        bubbles: true,
        composed: true,
      }),
    )
  }
}

defineElement(INCIDENT_LIST_TAG, IncidentList)
