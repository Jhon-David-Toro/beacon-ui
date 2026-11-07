import type { IncidentSeed, ServiceSeed } from './services.types'

export const SERVICE_STATUSES = ['operational', 'degraded', 'outage', 'maintenance'] as const
export const INCIDENT_PHASES = ['investigating', 'identified', 'monitoring', 'resolved'] as const

export const LATENCY_SAMPLES = 48
export const UPTIME_DAYS = 90
export const LATENCY_SLO_MS = 250
export const MOCK_NETWORK_DELAY_MS = 450

export const SERVICE_SEEDS: readonly ServiceSeed[] = [
  {
    id: 'api-gateway',
    name: 'API gateway',
    description: 'Routes and authenticates every public API request.',
    region: 'us-east-1',
    status: 'operational',
    baseLatency: 82,
    seed: 11,
  },
  {
    id: 'checkout',
    name: 'Checkout',
    description: 'Carts, payments and order confirmation.',
    region: 'us-east-1',
    status: 'degraded',
    baseLatency: 190,
    seed: 23,
  },
  {
    id: 'search',
    name: 'Search',
    description: 'Product and content search, including autocomplete.',
    region: 'eu-west-1',
    status: 'operational',
    baseLatency: 64,
    seed: 37,
  },
  {
    id: 'auth',
    name: 'Sign-in',
    description: 'Sign-in, sessions and two-step verification.',
    region: 'us-east-1',
    status: 'operational',
    baseLatency: 110,
    seed: 41,
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Email, push and SMS delivery.',
    region: 'eu-west-1',
    status: 'outage',
    baseLatency: 140,
    seed: 53,
  },
  {
    id: 'media-cdn',
    name: 'Media CDN',
    description: 'Images and video served from the edge.',
    region: 'global',
    status: 'operational',
    baseLatency: 38,
    seed: 67,
  },
  {
    id: 'reporting',
    name: 'Reporting',
    description: 'Dashboards, exports and scheduled reports.',
    region: 'sa-east-1',
    status: 'maintenance',
    baseLatency: 230,
    seed: 79,
  },
  {
    id: 'webhooks',
    name: 'Webhooks',
    description: 'Event delivery to customer endpoints, with retries.',
    region: 'us-west-2',
    status: 'operational',
    baseLatency: 96,
    seed: 83,
  },
]

export const INCIDENT_SEEDS: readonly IncidentSeed[] = [
  {
    serviceId: 'notifications',
    title: 'Push notifications are not being delivered',
    details:
      'Our push provider is rejecting requests. Email and SMS are not affected. We are failing over to the secondary provider.',
    severity: 'outage',
    phase: 'identified',
    hoursAgo: 1,
  },
  {
    serviceId: 'checkout',
    title: 'Slow payment confirmation',
    details:
      'Card payments take up to 8 seconds to confirm. Orders still go through. We traced it to a slow fraud-check dependency.',
    severity: 'degraded',
    phase: 'monitoring',
    hoursAgo: 3,
  },
  {
    serviceId: 'reporting',
    title: 'Scheduled database upgrade',
    details: 'Exports are paused during the upgrade. Dashboards stay available in read-only mode.',
    severity: 'maintenance',
    phase: 'identified',
    hoursAgo: 5,
  },
  {
    serviceId: 'search',
    title: 'Autocomplete returned empty results',
    details: 'A bad index deploy emptied suggestions for 14 minutes. We rolled it back.',
    severity: 'degraded',
    phase: 'resolved',
    hoursAgo: 52,
  },
  {
    serviceId: 'auth',
    title: 'Two-step codes delayed',
    details: 'SMS codes arrived up to 3 minutes late in some regions.',
    severity: 'degraded',
    phase: 'resolved',
    hoursAgo: 140,
  },
]
