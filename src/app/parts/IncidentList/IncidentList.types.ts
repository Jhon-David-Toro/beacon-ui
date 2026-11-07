import type { IncidentList } from './IncidentList'

export interface ResolveDetail {
  readonly id: string
}

declare global {
  interface HTMLElementTagNameMap {
    'beacon-incident-list': IncidentList
  }

  interface HTMLElementEventMap {
    'beacon-resolve': CustomEvent<ResolveDetail>
  }
}
