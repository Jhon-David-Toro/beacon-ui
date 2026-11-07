import type { UptimeDay } from '../../../design-system'

/**
 * Thirty days of sample uptime with two bad days, for the gallery.
 */
export function demoUptime(): UptimeDay[] {
  return Array.from({ length: 30 }, (_, index) => ({
    date: `2026-10-${String(index + 1).padStart(2, '0')}`,
    uptime: [6, 19].includes(index) ? (index === 6 ? 99.4 : 97.1) : 100,
  }))
}
