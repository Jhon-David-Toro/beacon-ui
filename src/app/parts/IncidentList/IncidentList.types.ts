import type { IncidentList } from './IncidentList'

/** Payload of the `beacon-resolve` event. */
export interface ResolveDetail {
  /** Id of the incident to resolve. */
  readonly id: string
}

declare global {
  /** Lets `querySelector('beacon-incident-list')` return the right type. */
  interface HTMLElementTagNameMap {
    /** Incident timeline. */
    'beacon-incident-list': IncidentList
  }

  /** Types `addEventListener` for the timeline events. */
  interface HTMLElementEventMap {
    /** The user asked to resolve an incident. */
    'beacon-resolve': CustomEvent<ResolveDetail>
  }
}
