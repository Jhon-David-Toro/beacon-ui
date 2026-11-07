import type { ReportView } from './ReportView'

declare global {
  /** Lets `querySelector('beacon-report')` return the right type. */
  interface HTMLElementTagNameMap {
    /** Incident report page. */
    'beacon-report': ReportView
  }
}
