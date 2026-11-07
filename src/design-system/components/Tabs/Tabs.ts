import { LitElement, html, unsafeCSS } from 'lit'
import type { PropertyValues } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { defineElement } from '../../shared'
import panelStyles from './TabPanel.scss?inline'
import { TAB_CHANGE_EVENT, TAB_PANEL_TAG, TABS_TAG } from './Tabs.constants'
import styles from './Tabs.scss?inline'
import type { TabChangeDetail } from './Tabs.types'
import { clampIndex, nextTabIndex } from './Tabs.utils'

/**
 * Content panel inside `bc-tabs`. Its `label` becomes the tab's text.
 *
 * @tag bc-tab-panel
 * @slot - Panel content.
 */
export class BcTabPanel extends LitElement {
  /** Compiled styles, adopted by the shadow root. */
  static override styles = unsafeCSS(panelStyles)

  /** Reactive properties; each one is documented on its field. */
  static override properties = {
    label: { reflect: true },
  }

  /**
   * Text of the tab that opens this panel, also the panel's accessible name.
   *
   * @default ''
   */
  declare label: string

  /** Exposes the `tabpanel` role and name without touching host attributes. */
  readonly #internals: ElementInternals

  /** Sets the defaults and the `tabpanel` role. */
  constructor() {
    super()
    this.label = ''
    this.#internals = this.attachInternals()
    this.#internals.role = 'tabpanel'
  }

  /** Makes the panel focusable, as the WAI-ARIA tabs pattern asks. */
  override connectedCallback(): void {
    super.connectedCallback()
    this.tabIndex = 0
  }

  /**
   * Keeps the accessible name in step with `label`.
   *
   * @param changed - Properties that changed in this update.
   */
  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed)
    this.#internals.ariaLabel = this.label
  }

  /**
   * Renders the slotted content.
   *
   * @returns The panel template.
   */
  override render() {
    return html`<slot></slot>`
  }
}

/**
 * Tab list built from its `bc-tab-panel` children, with the keyboard model
 * of the WAI-ARIA tabs pattern (roving tabindex, arrows, Home, End).
 *
 * @tag bc-tabs
 * @slot - `bc-tab-panel` elements.
 * @fires bc-tab-change - When the user selects another tab. `detail.index` is the new tab.
 * @example
 * ```html
 * <bc-tabs label="Service details">
 *   <bc-tab-panel label="Latency">…</bc-tab-panel>
 *   <bc-tab-panel label="Uptime">…</bc-tab-panel>
 * </bc-tabs>
 * ```
 */
export class BcTabs extends LitElement {
  /** Compiled styles, adopted by the shadow root. */
  static override styles = unsafeCSS(styles)

  /** Reactive properties; each one is documented on its field. */
  static override properties = {
    selected: { type: Number, reflect: true },
    label: {},
    panels: { state: true },
  }

  /**
   * Index of the open panel.
   *
   * @default 0
   */
  declare selected: number

  /**
   * Accessible name of the tab list.
   *
   * @default ''
   */
  declare label: string

  /** Panels currently slotted, in order. */
  declare private panels: BcTabPanel[]

  /** Sets the defaults. */
  constructor() {
    super()
    this.selected = 0
    this.label = ''
    this.panels = []
  }

  /**
   * Shows the selected panel after every render.
   *
   * @param changed - Properties that changed in this update.
   */
  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed)
    this.#syncPanels()
  }

  /**
   * Renders one tab per panel and the slot for the panels.
   *
   * @returns The tabs template.
   */
  override render() {
    return html`<div role="tablist" aria-label=${this.label} @keydown=${this.#handleKeydown}>
        ${this.#renderTabs()}
      </div>
      <slot @slotchange=${this.#collectPanels}></slot>`
  }

  /**
   * Tab buttons, with a roving tabindex on the selected one.
   *
   * @returns The tab templates.
   */
  #renderTabs() {
    const current = clampIndex(this.selected, this.panels.length)

    return repeat(
      this.panels,
      (panel) => panel,
      (panel, index) =>
        html`<button
          role="tab"
          type="button"
          aria-selected=${index === current ? 'true' : 'false'}
          tabindex=${index === current ? 0 : -1}
          data-index=${index}
          @click=${this.#handleClick}
        >
          ${panel.label}
        </button>`,
    )
  }

  /**
   * Reads the panels from the default slot.
   *
   * @param event - `slotchange` event of the default slot.
   */
  readonly #collectPanels = (event: Event): void => {
    const slot = event.target as HTMLSlotElement
    this.panels = slot
      .assignedElements()
      .filter((element): element is BcTabPanel => element.localName === TAB_PANEL_TAG)
  }

  /** Shows the selected panel and hides the rest. */
  #syncPanels(): void {
    const current = clampIndex(this.selected, this.panels.length)
    this.panels.forEach((panel, index) => {
      panel.hidden = index !== current
    })
  }

  /**
   * Selects the clicked tab.
   *
   * @param event - Click on a tab button.
   */
  readonly #handleClick = (event: Event): void => {
    const tab = event.currentTarget as HTMLElement
    this.#select(Number(tab.dataset.index))
  }

  /**
   * Moves the selection with the keyboard and focuses the new tab.
   *
   * @param event - Key press inside the tab list.
   */
  readonly #handleKeydown = (event: KeyboardEvent): void => {
    const next = nextTabIndex(this.selected, event.key, this.panels.length)
    if (next === null) {
      return
    }
    event.preventDefault()
    this.#select(next)
    void this.updateComplete.then(() => {
      this.renderRoot.querySelector<HTMLElement>(`[data-index="${next}"]`)?.focus()
    })
  }

  /**
   * Opens a panel and tells listeners about it.
   *
   * @param index - Panel to open.
   */
  #select(index: number): void {
    if (index === this.selected) {
      return
    }
    this.selected = index
    this.dispatchEvent(
      new CustomEvent<TabChangeDetail>(TAB_CHANGE_EVENT, { detail: { index }, bubbles: true }),
    )
  }
}

defineElement(TAB_PANEL_TAG, BcTabPanel)
defineElement(TABS_TAG, BcTabs)
