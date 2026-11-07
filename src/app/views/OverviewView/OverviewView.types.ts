import type { OverviewView } from './OverviewView'

export interface ServiceFilters {
  readonly query: string
  readonly status: string
}

declare global {
  interface HTMLElementTagNameMap {
    'beacon-overview': OverviewView
  }
}
