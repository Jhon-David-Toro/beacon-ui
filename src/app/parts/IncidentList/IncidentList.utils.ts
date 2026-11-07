import { PHASE_LABELS } from '../../core/format'
import type { Incident } from '../../data'

/**
 * Text before the start time: the current phase for open incidents, just
 * "Started" for resolved ones, whose badge already says "Resolved".
 *
 * @param incident - Incident being described.
 */
export function startedPrefix(incident: Incident): string {
  return incident.phase === 'resolved' ? 'Started' : `${PHASE_LABELS[incident.phase]}, started`
}
