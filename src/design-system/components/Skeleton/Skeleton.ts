import { LitElement, unsafeCSS } from 'lit'
import { defineElement } from '../../shared'
import { SKELETON_TAG } from './Skeleton.constants'
import styles from './Skeleton.scss?inline'

/**
 * Placeholder shown while content loads. Size it with `width`/`height` CSS.
 * It is decorative: announce the loading state from the container instead.
 *
 * @tag bc-skeleton
 * @example
 * ```html
 * <div aria-busy="true"><bc-skeleton style="width: 40%"></bc-skeleton></div>
 * ```
 */
export class BcSkeleton extends LitElement {
  /** Compiled styles, adopted by the shadow root. */
  static override styles = unsafeCSS(styles)

  /** Hides the placeholder from assistive technology. */
  override connectedCallback(): void {
    super.connectedCallback()
    this.setAttribute('aria-hidden', 'true')
  }
}

defineElement(SKELETON_TAG, BcSkeleton)
