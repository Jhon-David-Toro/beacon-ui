import { UPTIME_DEGRADED, UPTIME_HEALTHY } from './UptimeBar.constants'
import type { UptimeDay, UptimeLevel } from './UptimeBar.types'

/**
 * Classifies one day's uptime percentage.
 *
 * @param uptime - Percentage from 0 to 100, or `null` when not measured.
 */
export function uptimeLevel(uptime: number | null): UptimeLevel {
  if (uptime === null) {
    return 'empty'
  }
  if (uptime >= UPTIME_HEALTHY) {
    return 'healthy'
  }
  return uptime >= UPTIME_DEGRADED ? 'degraded' : 'down'
}

/**
 * Average uptime of the measured days, or `null` if none were measured.
 *
 * @param days - Daily uptime records.
 */
export function averageUptime(days: readonly UptimeDay[]): number | null {
  const measured = days.flatMap((day) => (day.uptime === null ? [] : [day.uptime]))
  if (measured.length === 0) {
    return null
  }
  return measured.reduce((sum, value) => sum + value, 0) / measured.length
}

/**
 * Formats an uptime percentage the way status pages do: two decimals, never
 * rounding up to 100 % unless it really is 100 %.
 *
 * @param uptime - Percentage, or `null` when unknown.
 */
export function formatUptime(uptime: number | null): string {
  if (uptime === null) {
    return 'No data'
  }
  return `${(Math.floor(uptime * 100) / 100).toFixed(2)}%`
}

/**
 * Text read by screen readers for one day of the bar.
 *
 * @param day - Daily uptime record.
 */
export function describeDay(day: UptimeDay): string {
  return `${day.date}: ${formatUptime(day.uptime)}`
}

/**
 * Accessible summary of the whole bar.
 *
 * @param label - Name of what is being measured.
 * @param days - Daily uptime records.
 */
export function describeUptime(label: string, days: readonly UptimeDay[]): string {
  const incidents = days.filter((day) => uptimeLevel(day.uptime) !== 'healthy').length
  const average = formatUptime(averageUptime(days))
  return `${label}: ${average} over ${days.length} days, ${incidents} with issues`
}
