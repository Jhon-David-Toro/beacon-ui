import type { ReportView } from './ReportView'

declare global {
  interface HTMLElementTagNameMap {
    'beacon-report': ReportView
  }
}
