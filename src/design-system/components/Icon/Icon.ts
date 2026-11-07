import { LitElement, html, svg, unsafeCSS } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { defineElement } from '../../shared'
import { DEFAULT_ICON_SIZE, ICON_PATHS, ICON_TAG } from './Icon.constants'
import type { IconName } from './Icon.types'
import styles from './Icon.scss?inline'

/**
 * Stroke icon from the built-in set. Decorative by default; give it a
 * `label` when the icon carries meaning on its own.
 *
 * @tag bc-icon
 */
export class BcIcon extends LitElement {
  static override styles = unsafeCSS(styles)

  static override properties = {
    name: { reflect: true },
    size: { type: Number },
    label: {},
  }

  declare name: IconName
  /** Width and height in pixels. */
  declare size: number
  /** Accessible name. When empty the icon is hidden from assistive tech. */
  declare label: string | undefined

  constructor() {
    super()
    this.name = 'check'
    this.size = DEFAULT_ICON_SIZE
    this.label = undefined
  }

  override render() {
    return html`<svg
      viewBox="0 0 24 24"
      width=${this.size}
      height=${this.size}
      role=${ifDefined(this.label ? 'img' : undefined)}
      aria-label=${ifDefined(this.label)}
      aria-hidden=${ifDefined(this.label ? undefined : 'true')}
    >
      ${svg`<path d=${ICON_PATHS[this.name]}></path>`}
    </svg>`
  }
}

defineElement(ICON_TAG, BcIcon)
