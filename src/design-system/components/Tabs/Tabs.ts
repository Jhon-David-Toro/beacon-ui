import { LitElement, html, unsafeCSS } from 'lit'
import type { PropertyValues } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { defineElement } from '../../shared'
import { TAB_CHANGE_EVENT, TAB_PANEL_TAG, TABS_TAG } from './Tabs.constants'
import type { TabChangeDetail } from './Tabs.types'
import { clampIndex, nextTabIndex } from './Tabs.utils'
import styles from './Tabs.scss?inline'
import tabPanelStyles from './TabPanel.scss?inline'

/**
 * Content panel inside `bc-tabs`. Its `label` becomes the tab's text.
 *
 * @tag bc-tab-panel
 * @slot - Panel content.
 */
export class BcTabPanel extends LitElement {
  static override styles = unsafeCSS(tabPanelStyles)

  static override properties = {
    label: { reflect: true },
  }

  /** Text of the tab that opens this panel. */
  declare label: string

  readonly #internals: ElementInternals

  constructor() {
    super()
    this.label = ''
    this.#internals = this.attachInternals()
    this.#internals.role = 'tabpanel'
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.tabIndex = 0
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed)
    this.#internals.ariaLabel = this.label
  }

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
 */
export class BcTabs extends LitElement {
  static override styles = unsafeCSS(styles)

  static override properties = {
    selected: { type: Number, reflect: true },
    label: {},
    panels: { state: true },
  }

  /** Index of the open panel. */
  declare selected: number
  /** Accessible name of the tab list. */
  declare label: string
  declare private panels: BcTabPanel[]

  constructor() {
    super()
    this.selected = 0
    this.label = ''
    this.panels = []
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed)
    this.#syncPanels()
  }

  override render() {
    const current = clampIndex(this.selected, this.panels.length)
    return html`<div role="tablist" aria-label=${this.label} @keydown=${this.#handleKeydown}>
        ${repeat(
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
        )}
      </div>
      <slot @slotchange=${this.#collectPanels}></slot>`
  }

  /** Reads the panels from the default slot. */
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

  /** Selects the clicked tab. */
  readonly #handleClick = (event: Event): void => {
    const tab = event.currentTarget as HTMLElement
    this.#select(Number(tab.dataset.index))
  }

  /** Moves the selection with the keyboard and focuses the new tab. */
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
