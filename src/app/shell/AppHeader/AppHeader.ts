import { LitElement, html, unsafeCSS } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { repeat } from 'lit/directives/repeat.js'
import '../../../design-system'
import { defineElement } from '../../../design-system/shared'
import { href } from '../../core/router'
import type { RouteName } from '../../core/router'
import { ThemeController } from '../../core/theme'
import type { ServiceStatus } from '../../data'
import '../../parts/BeaconMark'
import { APP_HEADER_TAG, NAV_ITEMS } from './AppHeader.constants'
import styles from './AppHeader.scss?inline'

/**
 * Top bar: brand, main navigation, report button and theme toggle.
 *
 * @tag beacon-header
 */
export class AppHeader extends LitElement {
  static override styles = unsafeCSS(styles)

  static override properties = {
    route: {},
    status: {},
  }

  /** Current route, to mark the active link. */
  declare route: RouteName
  /** Worst status right now, shown on the brand mark. */
  declare status: ServiceStatus

  readonly #theme = new ThemeController(this)

  constructor() {
    super()
    this.route = 'overview'
    this.status = 'operational'
  }

  override render() {
    const dark = this.#theme.theme === 'dark'
    return html`<header class="bar">
      <a class="brand" href=${href('/')}>
        <beacon-mark status=${this.status}></beacon-mark>
        Beacon
      </a>
      <nav aria-label="Main">
        <ul>
          ${repeat(
            NAV_ITEMS,
            (item) => item.route,
            (item) =>
              html`<li>
                <a
                  href=${href(item.path)}
                  aria-current=${ifDefined(item.route === this.route ? 'page' : undefined)}
                  >${item.label}</a
                >
              </li>`,
          )}
        </ul>
      </nav>
      <bc-button class="report" variant="primary" href=${href('/report')}>
        <bc-icon name="plus" size="16"></bc-icon>Report incident
      </bc-button>
      <bc-button
        variant="ghost"
        label=${dark ? 'Switch to light theme' : 'Switch to dark theme'}
        @click=${this.#toggleTheme}
      >
        <bc-icon name=${dark ? 'sun' : 'moon'}></bc-icon>
      </bc-button>
    </header>`
  }

  /** Flips the colour theme. */
  readonly #toggleTheme = (): void => {
    this.#theme.toggle()
  }
}

defineElement(APP_HEADER_TAG, AppHeader)
