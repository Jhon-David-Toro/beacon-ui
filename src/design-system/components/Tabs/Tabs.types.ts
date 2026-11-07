import type { BcTabPanel, BcTabs } from './Tabs'

export interface TabChangeDetail {
  readonly index: number
}

declare global {
  interface HTMLElementTagNameMap {
    'bc-tabs': BcTabs
    'bc-tab-panel': BcTabPanel
  }

  interface HTMLElementEventMap {
    'bc-tab-change': CustomEvent<TabChangeDetail>
  }
}
