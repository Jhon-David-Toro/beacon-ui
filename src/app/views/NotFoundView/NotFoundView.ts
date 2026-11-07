import { LitElement, html, unsafeCSS } from 'lit'
import '../../../design-system'
import { defineElement } from '../../../design-system/shared'
import { href } from '../../core/router'
import { NOT_FOUND_VIEW_TAG } from './NotFoundView.constants'
import styles from './NotFoundView.scss?inline'

/**
 * Shown for any address the router does not know.
 *
 * @tag beacon-not-found
 */
export class NotFoundView extends LitElement {
  static override styles = unsafeCSS(styles)

  override render() {
    return html`<div class="container">
      <h1>This page does not exist.</h1>
      <p>The link may be old or mistyped. The overview lists every service Beacon watches.</p>
      <bc-button variant="primary" href=${href('/')}>Go to the overview</bc-button>
    </div>`
  }
}

defineElement(NOT_FOUND_VIEW_TAG, NotFoundView)
