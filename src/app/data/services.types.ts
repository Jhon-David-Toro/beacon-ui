import type { UptimeDay } from '../../design-system'
import type { INCIDENT_PHASES, SERVICE_STATUSES } from './services.constants'

export type ServiceStatus = (typeof SERVICE_STATUSES)[number]

export type IncidentPhase = (typeof INCIDENT_PHASES)[number]

export type IncidentSeverity = Exclude<ServiceStatus, 'operational'>

export interface Incident {
  readonly id: string
  readonly serviceId: string
  readonly title: string
  readonly details: string
  readonly severity: IncidentSeverity
  readonly phase: IncidentPhase
  readonly startedAt: string
  readonly reportedByYou: boolean
}

export interface ServiceSeed {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly region: string
  readonly status: ServiceStatus
  readonly baseLatency: number
  readonly seed: number
}

export interface Service {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly region: string
  readonly status: ServiceStatus
  readonly latency: readonly number[]
  readonly uptime: readonly UptimeDay[]
  readonly incidents: readonly Incident[]
}

export interface IncidentSeed {
  readonly serviceId: string
  readonly title: string
  readonly details: string
  readonly severity: IncidentSeverity
  readonly phase: IncidentPhase
  readonly hoursAgo: number
}
