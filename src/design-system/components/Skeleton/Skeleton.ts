import { LitElement, unsafeCSS } from 'lit'
import { defineElement } from '../../shared'
import { SKELETON_TAG } from './Skeleton.constants'
import styles from './Skeleton.scss?inline'

/**
 * Placeholder shown while content loads. Size it with `width`/`height` CSS.
 * It is decorative: announce the loading state from the container instead.
 *
 * @tag bc-skeleton
 */
export class BcSkeleton extends LitElement {
  static override styles = unsafeCSS(styles)

  override connectedCallback(): void {
    super.connectedCallback()
    this.setAttribute('aria-hidden', 'true')
  }
}

defineElement(SKELETON_TAG, BcSkeleton)
