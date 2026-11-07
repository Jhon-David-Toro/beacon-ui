import { LitElement, html, unsafeCSS } from 'lit'
import '../../../design-system'
import { defineElement } from '../../../design-system/shared'
import { notify } from '../../core/events'
import { href } from '../../core/router'
import { StoreController, reportFromFormData } from '../../core/store'
import {
  DETAILS_MAX_LENGTH,
  REPORT_VIEW_TAG,
  SERVICE_OPTIONS,
  SEVERITY_OPTIONS,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from './ReportView.constants'
import styles from './ReportView.scss?inline'
import { preselectedService, serviceName } from './ReportView.utils'

/**
 * Incident report form. Every control is a form-associated custom element,
 * so this is a plain `<form>`: native validation, `FormData` and reset all
 * work without a form library.
 *
 * @tag beacon-report
 */
export class ReportView extends LitElement {
  static override styles = unsafeCSS(styles)

  static override properties = {
    serviceId: { attribute: 'service-id' },
  }

  /** Service to preselect, from `?service=` in the URL. */
  declare serviceId: string

  readonly #store = new StoreController(this)

  constructor() {
    super()
    this.serviceId = ''
  }

  override render() {
    return html`<div class="container layout">
      <div>
        <h1>Report an incident</h1>
        <p class="intro">
          Tell the on-call team what is broken. The report shows on the service page straight away.
        </p>
        <form novalidate @submit=${this.#handleSubmit}>
          <div class="pair">
            <bc-select
              name="service"
              label="Service"
              placeholder="Choose a service"
              .options=${SERVICE_OPTIONS}
              value=${preselectedService(this.serviceId)}
              required
            ></bc-select>
            <bc-select
              name="severity"
              label="Impact"
              .options=${SEVERITY_OPTIONS}
              value="degraded"
              required
            ></bc-select>
          </div>
          <bc-text-field
            name="title"
            label="What is happening"
            placeholder="Checkout returns 500 errors"
            minlength=${TITLE_MIN_LENGTH}
            maxlength=${TITLE_MAX_LENGTH}
            hint="One line, written for customers."
            required
          ></bc-text-field>
          <bc-text-field
            name="details"
            label="Details"
            maxlength=${DETAILS_MAX_LENGTH}
            hint="What users see, since when, and any workaround."
            multiline
          ></bc-text-field>
          <bc-switch name="notify" checked>Email status subscribers</bc-switch>
          <div class="actions">
            <bc-button type="submit" variant="primary">Report incident</bc-button>
            <bc-button type="reset" variant="ghost">Clear form</bc-button>
          </div>
        </form>
      </div>
      <aside aria-labelledby="next-title">
        <h2 id="next-title">After you report</h2>
        <ol>
          <li>The service status changes to match the impact you chose.</li>
          <li>The incident opens as “Investigating” on the service page.</li>
          <li>Mark it resolved from there once the fix is confirmed.</li>
        </ol>
      </aside>
    </div>`
  }

  /**
   * Stores the report, confirms it and opens the service page. Invalid
   * controls show their own inline errors, and focus moves to the first one.
   */
  readonly #handleSubmit = (event: SubmitEvent): void => {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    if (!form.checkValidity()) {
      form.querySelector<HTMLElement>(':invalid')?.focus()
      return
    }
    const report = reportFromFormData(new FormData(form))
    const store = this.#store.store
    if (!report || !store) {
      return
    }
    store.report(report)
    notify(this, {
      message: `Incident reported for ${serviceName(report.serviceId)}.`,
      tone: 'success',
    })
    location.hash = href(`/services/${report.serviceId}`)
  }
}

defineElement(REPORT_VIEW_TAG, ReportView)
