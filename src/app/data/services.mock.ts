import type { UptimeDay } from '../../design-system'
import { INCIDENT_SEEDS, LATENCY_SAMPLES, SERVICE_SEEDS, UPTIME_DAYS } from './services.constants'
import { seededRandom } from './random.utils'
import type { Incident, IncidentSeed, Service, ServiceSeed, ServiceStatus } from './services.types'

/** One hour in milliseconds. */
const HOUR_MS = 3_600_000

/** One day in milliseconds. */
const DAY_MS = 24 * HOUR_MS

/**
 * Builds the full mock data set relative to `now`.
 *
 * @param now - Reference time; tests pass a fixed date.
 * @returns Every service with its charts and incidents.
 */
export function buildServices(now: Date): Service[] {
  return SERVICE_SEEDS.map((seed) => buildService(seed, now))
}

/**
 * Builds one service with its latency, uptime and incidents.
 *
 * @param seed - Static service definition.
 * @param now - Reference time.
 * @returns The service, ready for the views.
 */
export function buildService(seed: ServiceSeed, now: Date): Service {
  const random = seededRandom(seed.seed)

  return {
    id: seed.id,
    name: seed.name,
    description: seed.description,
    region: seed.region,
    status: seed.status,
    latency: buildLatency(seed, random),
    uptime: buildUptime(seed.status, random, now),
    incidents: INCIDENT_SEEDS.filter((incident) => incident.serviceId === seed.id).map(
      (incident, index) => buildIncident(incident, index, now),
    ),
  }
}

/**
 * Latency samples for the last 24 hours, one every 30 minutes. Unhealthy
 * services ramp up over the last few hours, like a real regression would.
 *
 * @param seed - Service definition.
 * @param random - Seeded generator.
 * @returns Response times in milliseconds, oldest first.
 */
function buildLatency(seed: ServiceSeed, random: () => number): number[] {
  const recentRamp = seed.status === 'operational' || seed.status === 'maintenance' ? 0 : 1.6

  return Array.from({ length: LATENCY_SAMPLES }, (_, index) => {
    const noise = (random() - 0.5) * seed.baseLatency * 0.22
    const daily = Math.sin((index / LATENCY_SAMPLES) * Math.PI * 2) * seed.baseLatency * 0.12
    const ramp = index > LATENCY_SAMPLES - 8 ? (index - (LATENCY_SAMPLES - 8)) * recentRamp * 12 : 0

    return Math.max(8, Math.round(seed.baseLatency + noise + daily + ramp))
  })
}

/**
 * Daily uptime for the last 90 days, with occasional dips. Today reflects
 * the current status.
 *
 * @param status - Current status of the service.
 * @param random - Seeded generator.
 * @param now - Reference time.
 * @returns One record per day, oldest first, ending today.
 */
function buildUptime(status: ServiceStatus, random: () => number, now: Date): UptimeDay[] {
  return Array.from({ length: UPTIME_DAYS }, (_, index) => {
    const daysAgo = UPTIME_DAYS - 1 - index
    const date = new Date(now.getTime() - daysAgo * DAY_MS).toISOString().slice(0, 10)
    const uptime = daysAgo === 0 ? todayUptime(status) : historicUptime(random())

    return { date, uptime }
  })
}

/**
 * Uptime of the current day for a status.
 *
 * @param status - Current status.
 * @returns Uptime percentage for today.
 */
function todayUptime(status: ServiceStatus): number {
  const byStatus: Record<ServiceStatus, number> = {
    operational: 100,
    degraded: 99.4,
    outage: 96.8,
    maintenance: 99.95,
  }

  return byStatus[status]
}

/**
 * Uptime for a past day: mostly perfect, sometimes a short incident.
 *
 * @param roll - Random number in [0, 1).
 * @returns Uptime percentage for that day.
 */
function historicUptime(roll: number): number {
  if (roll > 0.988) {
    return 97.5 + roll
  }
  if (roll > 0.955) {
    return 99.2 + roll * 0.6
  }

  return 100
}

/**
 * Turns an incident seed into a dated incident.
 *
 * @param seed - Static incident definition.
 * @param index - Position, used to build a stable id.
 * @param now - Reference time.
 * @returns The incident with an id and a start date.
 */
function buildIncident(seed: IncidentSeed, index: number, now: Date): Incident {
  return {
    id: `${seed.serviceId}-${index}`,
    serviceId: seed.serviceId,
    title: seed.title,
    details: seed.details,
    severity: seed.severity,
    phase: seed.phase,
    startedAt: new Date(now.getTime() - seed.hoursAgo * HOUR_MS).toISOString(),
    reportedByYou: false,
  }
}
