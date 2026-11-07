import { LitElement, html, unsafeCSS } from 'lit'
import '../../../design-system'
import { averageUptime, formatUptime } from '../../../design-system'
import { defineElement } from '../../../design-system/shared'
import { STATUS_LABELS, STATUS_TONES, percentile, sparklineTone } from '../../core/format'
import { href } from '../../core/router'
import { LATENCY_SLO_MS } from '../../data'
import type { Service } from '../../data'
import { SERVICE_ROW_TAG } from './ServiceRow.constants'
import styles from './ServiceRow.scss?inline'

/**
 * One service in the overview list. The whole row is a single link, so it
 * is one tab stop with one clear accessible name.
 *
 * @tag beacon-service-row
 */
export class ServiceRow extends LitElement {
  static override styles = unsafeCSS(styles)

  static override properties = {
    service: { attribute: false },
  }

  declare service: Service | undefined

  constructor() {
    super()
    this.service = undefined
  }

  override render() {
    const service = this.service
    if (!service) {
      return html``
    }
    const p95 = percentile(service.latency, 95)
    return html`<a href=${href(`/services/${service.id}`)}>
      <span class="name">
        <span class="title">${service.name}</span>
        <span class="region">${service.region}</span>
      </span>
      <bc-badge class="status" tone=${STATUS_TONES[service.status]}
        >${STATUS_LABELS[service.status]}</bc-badge
      >
      <bc-sparkline
        .values=${service.latency}
        label="${service.name} latency, last 24 hours"
        unit="ms"
        tone=${sparklineTone(service.status)}
        threshold=${LATENCY_SLO_MS}
        height="32"
        area
      ></bc-sparkline>
      <span class="meta">
        <span
          ><span class="uptime">${formatUptime(averageUptime(service.uptime))}</span> uptime</span
        >
        <span>p95 ${p95} ms</span>
      </span>
    </a>`
  }
}

defineElement(SERVICE_ROW_TAG, ServiceRow)
