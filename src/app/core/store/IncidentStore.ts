import type { Incident } from '../../data'
import { STORAGE_KEY } from './store.constants'
import type { IncidentReport, StoreListener } from './store.types'
import { parseStored, toIncident } from './store.utils'

/**
 * Holds the incidents reported from this browser. It is a plain observable
 * class with no Lit dependency, so it can be tested and reused on its own.
 * Reports survive a reload through `sessionStorage` when it is available.
 */
export class IncidentStore {
  /** Callbacks run after every change. */
  readonly #listeners = new Set<StoreListener>()

  /** Where reports are persisted, or `null` to keep them in memory only. */
  readonly #storage: Storage | null

  /** Reported incidents, newest first. */
  #incidents: Incident[]

  /**
   * Loads any reports saved earlier in this tab.
   *
   * @param storage - Where to persist reports; pass `null` to keep them in memory only.
   */
  constructor(storage: Storage | null = safeSessionStorage()) {
    this.#storage = storage
    this.#incidents = parseStored(storage?.getItem(STORAGE_KEY) ?? null)
  }

  /**
   * Every reported incident.
   *
   * @returns The incidents, newest first.
   */
  get incidents(): readonly Incident[] {
    return this.#incidents
  }

  /**
   * Incidents reported for one service.
   *
   * @param serviceId - Service id.
   * @returns The incidents of that service, newest first.
   */
  forService(serviceId: string): Incident[] {
    return this.#incidents.filter((incident) => incident.serviceId === serviceId)
  }

  /**
   * Adds a report and notifies subscribers.
   *
   * @param report - Validated report.
   * @param now - Report time.
   * @returns The stored incident.
   */
  report(report: IncidentReport, now: Date = new Date()): Incident {
    const incident = toIncident(report, `reported-${crypto.randomUUID()}`, now)
    this.#set([incident, ...this.#incidents])

    return incident
  }

  /**
   * Marks a reported incident as resolved.
   *
   * @param id - Incident id.
   */
  resolve(id: string): void {
    this.#set(
      this.#incidents.map((incident) =>
        incident.id === id ? { ...incident, phase: 'resolved' } : incident,
      ),
    )
  }

  /**
   * Calls `listener` after every change.
   *
   * @param listener - Change callback.
   * @returns A function that unsubscribes.
   */
  subscribe(listener: StoreListener): () => void {
    this.#listeners.add(listener)

    return () => this.#listeners.delete(listener)
  }

  /**
   * Replaces the incidents, persists them and notifies subscribers.
   *
   * @param incidents - New list.
   */
  #set(incidents: Incident[]): void {
    this.#incidents = incidents
    try {
      this.#storage?.setItem(STORAGE_KEY, JSON.stringify(incidents))
    } catch {
      // Storage can be full or blocked (private mode); the in-memory copy still works.
    }
    this.#listeners.forEach((listener) => {
      listener()
    })
  }
}

/**
 * `sessionStorage`, guarded for sandboxed iframes where reading it throws.
 *
 * @returns The storage, or `null` when it is not available.
 */
function safeSessionStorage(): Storage | null {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}
