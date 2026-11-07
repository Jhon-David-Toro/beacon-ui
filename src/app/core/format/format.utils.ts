import type { SparklineTone } from '../../../design-system'
import type { ServiceStatus } from '../../data'
import { LOCALE, RELATIVE_UNITS, SPARKLINE_TONES, STATUS_SEVERITY } from './format.constants'

/** Formatter for "3 hours ago" style times. */
const relativeFormat = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' })
/** Formatter for absolute dates, such as "Nov 7, 2026, 11:03 AM". */
const dateFormat = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium', timeStyle: 'short' })

/**
 * Human relative time, e.g. "3 hours ago" or "now".
 *
 * @param iso - ISO date string.
 * @param now - Reference time.
 * @returns The relative time in words.
 */
export function formatRelative(iso: string, now: Date = new Date()): string {
  const diff = new Date(iso).getTime() - now.getTime()
  for (const [unit, size] of RELATIVE_UNITS) {
    if (Math.abs(diff) >= size) {
      return relativeFormat.format(Math.round(diff / size), unit)
    }
  }

  return relativeFormat.format(0, 'minute')
}

/**
 * Absolute date and time, used in `<time>` titles.
 *
 * @param iso - ISO date string.
 * @returns The date and time in the interface locale.
 */
export function formatDateTime(iso: string): string {
  return dateFormat.format(new Date(iso))
}

/**
 * Value at a percentile of a series, using the nearest-rank method.
 *
 * @param values - Data series.
 * @param percent - Percentile from 0 to 100.
 * @returns The value at that percentile, or 0 for an empty series.
 */
export function percentile(values: readonly number[], percent: number): number {
  if (values.length === 0) {
    return 0
  }
  const sorted = [...values].sort((a, b) => a - b)
  const rank = Math.ceil((percent / 100) * sorted.length)

  return sorted[Math.min(Math.max(rank - 1, 0), sorted.length - 1)] ?? 0
}

/**
 * The more severe of two statuses.
 *
 * @param a - First status.
 * @param b - Second status.
 * @returns Whichever status is worse.
 */
export function worstStatus(a: ServiceStatus, b: ServiceStatus): ServiceStatus {
  return STATUS_SEVERITY[b] > STATUS_SEVERITY[a] ? b : a
}

/**
 * Sentence for the overview headline.
 *
 * @param affected - Number of services that are not operational.
 * @returns The headline sentence.
 */
export function headline(affected: number): string {
  if (affected === 0) {
    return 'All systems are running normally.'
  }

  return affected === 1 ? '1 service needs attention.' : `${affected} services need attention.`
}

/**
 * Chart colour for a status. Maintenance is planned, so it stays neutral.
 *
 * @param status - Current status.
 * @returns The sparkline tone.
 */
export function sparklineTone(status: ServiceStatus): SparklineTone {
  return SPARKLINE_TONES[status]
}
