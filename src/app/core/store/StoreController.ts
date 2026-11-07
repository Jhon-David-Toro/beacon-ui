import { ContextConsumer } from '@lit/context'
import type { ReactiveController, ReactiveElement } from 'lit'
import type { IncidentStore } from './IncidentStore'
import { incidentStoreContext } from './store.context'

/**
 * Gives a component the `IncidentStore` provided by an ancestor and
 * re-renders the component whenever the store changes.
 */
export class StoreController implements ReactiveController {
  readonly #host: ReactiveElement
  readonly #consumer: ContextConsumer<typeof incidentStoreContext, ReactiveElement>
  #unsubscribe: (() => void) | undefined

  /**
   * @param host - Component that reads the store.
   */
  constructor(host: ReactiveElement) {
    this.#host = host
    this.#consumer = new ContextConsumer(host, {
      context: incidentStoreContext,
      subscribe: true,
      callback: this.#attach,
    })
    host.addController(this)
  }

  /** The provided store, once the context has resolved. */
  get store(): IncidentStore | undefined {
    return this.#consumer.value
  }

  hostDisconnected(): void {
    this.#unsubscribe?.()
    this.#unsubscribe = undefined
  }

  /** Subscribes to the store the context just delivered. */
  readonly #attach = (store: IncidentStore): void => {
    this.#unsubscribe?.()
    this.#unsubscribe = store.subscribe(() => {
      this.#host.requestUpdate()
    })
    this.#host.requestUpdate()
  }
}
