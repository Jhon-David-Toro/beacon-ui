import { LitElement, html, unsafeCSS } from 'lit'
import { defineElement } from '../../shared'
import { BADGE_TAG, DEFAULT_BADGE_TONE } from './Badge.constants'
import type { BadgeTone } from './Badge.types'
import styles from './Badge.scss?inline'

/**
 * Short status label with a coloured dot. The tone is never the only signal:
 * the slotted text always says what the colour means.
 *
 * @tag bc-badge
 * @slot - Label text.
 */
export class BcBadge extends LitElement {
  static override styles = unsafeCSS(styles)

  static override properties = {
    tone: { reflect: true },
    pulse: { type: Boolean, reflect: true },
  }

  /** Colour family, mapped to the status tokens. */
  declare tone: BadgeTone
  /** Animates the dot to draw attention to live problems. */
  declare pulse: boolean

  constructor() {
    super()
    this.tone = DEFAULT_BADGE_TONE
    this.pulse = false
  }

  override render() {
    return html`<span class="dot" part="dot" aria-hidden="true"></span><slot></slot>`
  }
}

defineElement(BADGE_TAG, BcBadge)
