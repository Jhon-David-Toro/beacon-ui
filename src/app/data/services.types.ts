import type { UptimeDay } from '../../design-system'
import type { INCIDENT_PHASES, SERVICE_STATUSES } from './services.constants'

/** Health of a service right now. */
export type ServiceStatus = (typeof SERVICE_STATUSES)[number]

/** Where an incident is in its lifecycle, from first report to fix. */
export type IncidentPhase = (typeof INCIDENT_PHASES)[number]

/** Impact of an incident: any status except `operational`. */
export type IncidentSeverity = Exclude<ServiceStatus, 'operational'>

/** Something that went wrong with a service. */
export interface Incident {
  /** Unique id. */
  readonly id: string

  /** Id of the affected service. */
  readonly serviceId: string

  /** One line, written for customers. */
  readonly title: string

  /** What users see, since when, and any workaround. Can be empty. */
  readonly details: string

  /** Impact on the service. */
  readonly severity: IncidentSeverity

  /** Current phase. */
  readonly phase: IncidentPhase

  /** When it started, as an ISO date string. */
  readonly startedAt: string

  /** Whether it was reported from this browser, which allows resolving it here. */
  readonly reportedByYou: boolean
}

/** Static definition of a mock service, before its charts are generated. */
export interface ServiceSeed {
  /** URL-safe id, used in routes. */
  readonly id: string

  /** Display name. */
  readonly name: string

  /** What the service does, in one sentence. */
  readonly description: string

  /** Cloud region, or `global` for edge services. */
  readonly region: string

  /** Status reported by the API. */
  readonly status: ServiceStatus

  /** Typical response time in milliseconds; the generator adds noise around it. */
  readonly baseLatency: number

  /** Seed of the random generator, so the charts are the same on every visit. */
  readonly seed: number
}

/** A monitored service, as returned by the API. */
export interface Service {
  /** URL-safe id, used in routes. */
  readonly id: string

  /** Display name. */
  readonly name: string

  /** What the service does, in one sentence. */
  readonly description: string

  /** Cloud region, or `global` for edge services. */
  readonly region: string

  /** Current status. */
  readonly status: ServiceStatus

  /** Response times of the last 24 hours in milliseconds, oldest first, every 30 minutes. */
  readonly latency: readonly number[]

  /** Daily uptime of the last 90 days, oldest first. */
  readonly uptime: readonly UptimeDay[]

  /** Incidents of the last 90 days, newest first. */
  readonly incidents: readonly Incident[]
}

/** Static definition of a mock incident, dated relative to "now" when generated. */
export interface IncidentSeed {
  /** Id of the affected service. */
  readonly serviceId: string

  /** One line, written for customers. */
  readonly title: string

  /** What users see, since when, and any workaround. */
  readonly details: string

  /** Impact on the service. */
  readonly severity: IncidentSeverity

  /** Current phase. */
  readonly phase: IncidentPhase

  /** How long ago it started, in hours. */
  readonly hoursAgo: number
}
