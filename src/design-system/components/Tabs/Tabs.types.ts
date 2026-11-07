import type { BcTabPanel, BcTabs } from './Tabs'

/** Payload of the `bc-tab-change` event. */
export interface TabChangeDetail {
  /** Index of the tab that is now selected. */
  readonly index: number
}

declare global {
  /** Lets `querySelector` return the right type for the tab elements. */
  interface HTMLElementTagNameMap {
    /** Tab list built from its panels. */
    'bc-tabs': BcTabs

    /** One panel of a tab list. */
    'bc-tab-panel': BcTabPanel
  }

  /** Types `addEventListener` for the tab events. */
  interface HTMLElementEventMap {
    /** The user selected another tab. */
    'bc-tab-change': CustomEvent<TabChangeDetail>
  }
}
