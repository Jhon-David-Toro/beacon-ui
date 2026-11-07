import { ContextConsumer } from '@lit/context'
import type { ReactiveController, ReactiveElement } from 'lit'
import type { IncidentStore } from './IncidentStore'
import { incidentStoreContext } from './store.context'

/**
 * Gives a component the `IncidentStore` provided by an ancestor and
 * re-renders the component whenever the store changes.
 */
export class StoreController implements ReactiveController {
  /** Component that reads the store. */
  readonly #host: ReactiveElement

  /** Receives the store from the nearest provider. */
  readonly #consumer: ContextConsumer<typeof incidentStoreContext, ReactiveElement>

  /** Stops listening to the current store. */
  #unsubscribe: (() => void) | undefined

  /**
   * Requests the store from the context and attaches to the host.
   *
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

  /**
   * The provided store, once the context has resolved.
   *
   * @returns The store, or `undefined` outside a provider.
   */
  get store(): IncidentStore | undefined {
    return this.#consumer.value
  }

  /** Stops listening when the host disconnects. */
  hostDisconnected(): void {
    this.#unsubscribe?.()
    this.#unsubscribe = undefined
  }

  /**
   * Subscribes to the store the context just delivered.
   *
   * @param store - Store from the provider.
   */
  readonly #attach = (store: IncidentStore): void => {
    this.#unsubscribe?.()
    this.#unsubscribe = store.subscribe(() => {
      this.#host.requestUpdate()
    })
    this.#host.requestUpdate()
  }
}
