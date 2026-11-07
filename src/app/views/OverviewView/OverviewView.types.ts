import type { OverviewView } from './OverviewView'

/** Filters of the service list. */
export interface ServiceFilters {
  /** Search text, matched against name, description and region. */
  readonly query: string

  /** Status to show, or `all`. */
  readonly status: string
}

declare global {
  /** Lets `querySelector('beacon-overview')` return the right type. */
  interface HTMLElementTagNameMap {
    /** Landing page. */
    'beacon-overview': OverviewView
  }
}
