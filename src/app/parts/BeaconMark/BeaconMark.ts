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
  static override styles = unsafeCSS(styles)

  static override properties = {
    status: { reflect: true },
    signal: { type: Boolean, reflect: true },
  }

  declare status: ServiceStatus
  /** Plays the radiating rings once. */
  declare signal: boolean

  constructor() {
    super()
    this.status = 'operational'
    this.signal = false
  }

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
