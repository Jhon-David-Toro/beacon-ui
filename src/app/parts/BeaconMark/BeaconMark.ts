import { LitElement, html, svg, unsafeCSS } from 'lit'
import { defineElement } from '../../../design-system/shared'
import type { ServiceStatus } from '../../data'
import { BEACON_MARK_TAG } from './BeaconMark.constants'
import styles from './BeaconMark.scss?inline'

/**
 * The Beacon logo: a lighthouse whose lamp takes the colour of the worst
 * current status. Decorative; the text next to it carries the meaning.
 *
 * @tag beacon-mark
 * @cssprop --beacon-size - Width and height. Defaults to 28px.
 */
export class BeaconMark extends LitElement {
  /** Compiled styles, adopted by the shadow root. */
  static override styles = unsafeCSS(styles)

  /** Reactive properties; each one is documented on its field. */
  static override properties = {
    status: { reflect: true },
    signal: { type: Boolean, reflect: true },
  }

  /**
   * Status whose colour the lamp takes.
   *
   * @default 'operational'
   */
  declare status: ServiceStatus

  /**
   * Plays the radiating rings once, on load.
   *
   * @default false
   */
  declare signal: boolean

  /** Sets the defaults. */
  constructor() {
    super()
    this.status = 'operational'
    this.signal = false
  }

  /**
   * Renders the lighthouse SVG.
   *
   * @returns The logo template.
   */
  override render() {
    return html`<svg viewBox="0 0 32 32" aria-hidden="true">
      ${svg`
        <circle class="ring" cx="16" cy="10" r="5"></circle>
        <circle class="ring" cx="16" cy="10" r="5"></circle>
        <circle class="ring" cx="16" cy="10" r="5"></circle>
        <circle class="lamp" cx="16" cy="10" r="4"></circle>
        <path class="tower" d="M12.5 15h7l2 15h-11l2-15Zm-.5-2h8v1.2h-8z"></path>
      `}
    </svg>`
  }
}

defineElement(BEACON_MARK_TAG, BeaconMark)
