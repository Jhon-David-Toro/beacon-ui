import type { IncidentSeverity } from '../../data'

/** What the incident form submits, already validated. */
export interface IncidentReport {
  /** Id of the affected service. */
  readonly serviceId: string

  /** One line, written for customers. */
  readonly title: string

  /** Longer description. Can be empty. */
  readonly details: string

  /** Impact on the service. */
  readonly severity: IncidentSeverity

  /** Whether status subscribers should be emailed. */
  readonly notify: boolean
}

/** Callback run after every change in the store. */
export type StoreListener = () => void
