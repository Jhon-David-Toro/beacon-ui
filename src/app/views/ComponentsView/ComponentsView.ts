import { LitElement, html, unsafeCSS } from 'lit'
import '../../../design-system'
import type { BcDialog } from '../../../design-system'
import { defineElement } from '../../../design-system/shared'
import { notify } from '../../core/events'
import { COMPONENTS_VIEW_TAG, DEMO_LATENCY, DEMO_OPTIONS } from './ComponentsView.constants'
import styles from './ComponentsView.scss?inline'
import { demoUptime } from './ComponentsView.utils'

/**
 * Living style guide: every Beacon component, live, with its tag name.
 *
 * @tag beacon-components
 */
export class ComponentsView extends LitElement {
  /** Compiled styles, adopted by the shadow root. */
  static override styles = unsafeCSS(styles)

  /** Sample uptime for the uptime bar demo. */
  readonly #uptime = demoUptime()

  /**
   * Renders the intro and one card per component group.
   *
   * @returns The page template.
   */
  override render() {
    return html`<div class="container">
      <h1>Components</h1>
      <p class="intro">
        Every element below is a standard Web Component built with Lit. They work in plain HTML,
        React, Angular or Vue, because the browser itself defines them.
      </p>
      <div class="grid">
        ${this.#renderActions()} ${this.#renderStatus()} ${this.#renderData()} ${this.#renderForm()}
        ${this.#renderOverlays()}
      </div>
    </div>`
  }

  /**
   * Buttons.
   *
   * @returns The button card.
   */
  #renderActions() {
    return html`<bc-card>
      <h2 slot="heading">Button</h2>
      <code slot="actions">&lt;bc-button&gt;</code>
      <div class="demo">
        <bc-button variant="primary">Save changes</bc-button>
        <bc-button>Cancel</bc-button>
        <bc-button variant="ghost">Skip</bc-button>
        <bc-button variant="danger">Delete</bc-button>
        <bc-button disabled>Disabled</bc-button>
      </div>
      <p>Form-associated: <code>type="submit"</code> submits the surrounding form.</p>
    </bc-card>`
  }

  /**
   * Badges and stats.
   *
   * @returns The badge and stat card.
   */
  #renderStatus() {
    return html`<bc-card>
      <h2 slot="heading">Badge and stat</h2>
      <code slot="actions">&lt;bc-badge&gt; &lt;bc-stat&gt;</code>
      <div class="demo">
        <bc-badge tone="success">Operational</bc-badge>
        <bc-badge tone="warning">Degraded</bc-badge>
        <bc-badge tone="danger" pulse>Outage</bc-badge>
        <bc-badge tone="info">Maintenance</bc-badge>
      </div>
      <div class="demo">
        <bc-stat label="p95 latency" value="182" unit="ms"></bc-stat>
        <bc-stat label="Uptime" value="99.98%"></bc-stat>
      </div>
    </bc-card>`
  }

  /**
   * Charts and tabs.
   *
   * @returns The charts and tabs card.
   */
  #renderData() {
    return html`<bc-card class="wide">
      <h2 slot="heading">Sparkline, uptime bar and tabs</h2>
      <code slot="actions">&lt;bc-tabs&gt; &lt;bc-sparkline&gt; &lt;bc-uptime-bar&gt;</code>
      <bc-tabs label="Chart examples">
        <bc-tab-panel label="Sparkline">
          <bc-sparkline
            .values=${DEMO_LATENCY}
            label="Example latency"
            unit="ms"
            tone="warning"
            threshold="150"
            width="600"
            height="96"
            area
          ></bc-sparkline>
        </bc-tab-panel>
        <bc-tab-panel label="Uptime bar">
          <bc-uptime-bar .days=${this.#uptime} label="Example service"></bc-uptime-bar>
        </bc-tab-panel>
        <bc-tab-panel label="Loading">
          <div class="stack"><bc-skeleton></bc-skeleton><bc-skeleton></bc-skeleton></div>
        </bc-tab-panel>
      </bc-tabs>
      <p>Arrow keys, Home and End move between tabs.</p>
    </bc-card>`
  }

  /**
   * Form controls.
   *
   * @returns The form controls card.
   */
  #renderForm() {
    return html`<bc-card>
      <h2 slot="heading">Form controls</h2>
      <code slot="actions">ElementInternals</code>
      <form class="stack" novalidate @submit=${this.#preventSubmit}>
        <bc-text-field name="email" label="Email" type="email" required></bc-text-field>
        <bc-select name="region" label="Region" .options=${DEMO_OPTIONS} value="eu"></bc-select>
        <bc-switch name="alerts" checked>Send alerts</bc-switch>
      </form>
      <p>Values, validity and reset come from the native form.</p>
    </bc-card>`
  }

  /**
   * Dialog and toast.
   *
   * @returns The dialog and toast card.
   */
  #renderOverlays() {
    return html`<bc-card>
      <h2 slot="heading">Dialog and toast</h2>
      <code slot="actions">&lt;bc-dialog&gt; &lt;bc-toast-region&gt;</code>
      <div class="demo">
        <bc-button @click=${this.#openDialog}>Open dialog</bc-button>
        <bc-button @click=${this.#showToast}>Show toast</bc-button>
      </div>
      <p>The dialog is a native modal: focus trap and Escape come from the browser.</p>
      <bc-dialog heading="Pause alerts for this service?">
        Alerts stop for one hour, then start again on their own.
        <bc-button slot="footer" @click=${this.#closeDialog}>Cancel</bc-button>
        <bc-button slot="footer" variant="primary" @click=${this.#closeDialog}
          >Pause alerts</bc-button
        >
      </bc-dialog>
    </bc-card>`
  }

  /**
   * The gallery's dialog.
   *
   * @returns The dialog, or `null` before the first render.
   */
  get #dialog(): BcDialog | null {
    return this.renderRoot.querySelector('bc-dialog')
  }

  /** Opens the demo dialog. */
  readonly #openDialog = (): void => {
    this.#dialog?.show()
  }

  /** Closes the demo dialog. */
  readonly #closeDialog = (): void => {
    this.#dialog?.close()
  }

  /** Shows a demo toast through the app shell. */
  readonly #showToast = (): void => {
    notify(this, { message: 'Alerts paused for one hour.', tone: 'success' })
  }

  /**
   * Keeps the demo form from submitting.
   *
   * @param event - `submit` event of the demo form.
   */
  readonly #preventSubmit = (event: Event): void => {
    event.preventDefault()
  }
}

defineElement(COMPONENTS_VIEW_TAG, ComponentsView)
