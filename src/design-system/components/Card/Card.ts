import { LitElement, html, unsafeCSS } from 'lit'
import { classMap } from 'lit/directives/class-map.js'
import { defineElement } from '../../shared'
import { CARD_TAG, DEFAULT_CARD_PADDING } from './Card.constants'
import type { CardPadding } from './Card.types'
import { hasAssignedContent } from './Card.utils'
import styles from './Card.scss?inline'

/**
 * Bordered surface that groups related content.
 *
 * @tag bc-card
 * @slot heading - Title, usually an `<h2>` or `<h3>`.
 * @slot actions - Controls aligned to the end of the header.
 * @slot - Body content.
 * @csspart card - Inner layout box.
 */
export class BcCard extends LitElement {
  static override styles = unsafeCSS(styles)

  static override properties = {
    padding: { reflect: true },
    hasHeader: { state: true },
  }

  /** Inner spacing. */
  declare padding: CardPadding
  declare private hasHeader: boolean

  constructor() {
    super()
    this.padding = DEFAULT_CARD_PADDING
    this.hasHeader = false
  }

  override render() {
    return html`<div class="card" part="card">
      <header class=${classMap({ empty: !this.hasHeader })}>
        <slot name="heading" @slotchange=${this.#updateHeader}></slot>
        <slot name="actions" @slotchange=${this.#updateHeader}></slot>
      </header>
      <slot></slot>
    </div>`
  }

  /** Collapses the header when neither header slot has content. */
  readonly #updateHeader = (): void => {
    const slots = this.renderRoot.querySelectorAll<HTMLSlotElement>('header slot')
    this.hasHeader = [...slots].some(hasAssignedContent)
  }
}

defineElement(CARD_TAG, BcCard)
