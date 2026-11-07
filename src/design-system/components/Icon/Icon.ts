import { LitElement, html, svg, unsafeCSS } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { defineElement } from '../../shared'
import { DEFAULT_ICON_SIZE, ICON_PATHS, ICON_TAG } from './Icon.constants'
import styles from './Icon.scss?inline'
import type { IconName } from './Icon.types'

/**
 * Stroke icon from the built-in set. Decorative by default; give it a
 * `label` when the icon carries meaning on its own.
 *
 * @tag bc-icon
 * @example
 * ```html
 * <bc-icon name="alert" label="Warning"></bc-icon>
 * ```
 */
export class BcIcon extends LitElement {
  /** Compiled styles, adopted by the shadow root. */
  static override styles = unsafeCSS(styles)

  /** Reactive properties; each one is documented on its field. */
  static override properties = {
    name: { reflect: true },
    size: { type: Number },
    label: {},
  }

  /**
   * Which icon to draw.
   *
   * @default 'check'
   */
  declare name: IconName

  /**
   * Width and height in pixels.
   *
   * @default 20
   */
  declare size: number

  /**
   * Accessible name. When empty the icon is hidden from assistive tech.
   *
   * @default undefined
   */
  declare label: string | undefined

  /** Sets the defaults. */
  constructor() {
    super()
    this.name = 'check'
    this.size = DEFAULT_ICON_SIZE
    this.label = undefined
  }

  /**
   * Renders the SVG, exposed as an image only when it has a label.
   *
   * @returns The icon template.
   */
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
