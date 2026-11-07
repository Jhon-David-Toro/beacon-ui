import type { IncidentSeverity } from '../../data'

export interface IncidentReport {
  readonly serviceId: string
  readonly title: string
  readonly details: string
  readonly severity: IncidentSeverity
  readonly notify: boolean
}

export type StoreListener = () => void
