import { LitElement, html, unsafeCSS } from 'lit'
import { defineElement } from '../../shared'
import { BADGE_TAG, DEFAULT_BADGE_TONE } from './Badge.constants'
import styles from './Badge.scss?inline'
import type { BadgeTone } from './Badge.types'

/**
 * Short status label with a coloured dot. The tone is never the only signal:
 * the slotted text always says what the colour means.
 *
 * @tag bc-badge
 * @slot - Label text.
 * @csspart dot - The coloured dot.
 * @example
 * ```html
 * <bc-badge tone="danger" pulse>Outage</bc-badge>
 * ```
 */
export class BcBadge extends LitElement {
  /** Compiled styles, adopted by the shadow root. */
  static override styles = unsafeCSS(styles)

  /** Reactive properties; each one is documented on its field. */
  static override properties = {
    tone: { reflect: true },
    pulse: { type: Boolean, reflect: true },
  }

  /**
   * Colour family, mapped to the status tokens.
   *
   * @default 'neutral'
   */
  declare tone: BadgeTone

  /**
   * Animates the dot to draw attention to live problems. Respects
   * `prefers-reduced-motion`.
   *
   * @default false
   */
  declare pulse: boolean

  /** Sets the defaults. */
  constructor() {
    super()
    this.tone = DEFAULT_BADGE_TONE
    this.pulse = false
  }

  /**
   * Renders the decorative dot followed by the label.
   *
   * @returns The badge template.
   */
  override render() {
    return html`<span class="dot" part="dot" aria-hidden="true"></span><slot></slot>`
  }
}

defineElement(BADGE_TAG, BcBadge)
