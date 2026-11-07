import { MOCK_NETWORK_DELAY_MS } from './services.constants'
import { buildServices } from './services.mock'
import type { Service } from './services.types'

/** Thrown when a service id does not exist, so views can show a 404. */
export class ServiceNotFoundError extends Error {
  /** Error name, shown in stack traces. */
  override readonly name = 'ServiceNotFoundError'

  /**
   * Creates the error for a missing service.
   *
   * @param serviceId - Id that was requested.
   */
  constructor(readonly serviceId: string) {
    super(`There is no service with the id "${serviceId}".`)
  }
}

/**
 * Resolves after `ms`, or rejects as soon as the signal aborts, which is how
 * `@lit/task` cancels a request the view no longer needs.
 *
 * @param ms - Delay in milliseconds.
 * @param signal - Abort signal from the caller.
 * @returns A promise that settles when the wait is over or aborted.
 */
export function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    signal?.throwIfAborted()
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(signal.reason as Error)
      },
      { once: true },
    )
  })
}

/**
 * Lists every monitored service. Stands in for `GET /services`.
 *
 * @param signal - Aborts the request.
 * @param delay - Simulated network time; tests pass 0.
 * @returns Every service.
 */
export async function fetchServices(
  signal?: AbortSignal,
  delay = MOCK_NETWORK_DELAY_MS,
): Promise<Service[]> {
  await wait(delay, signal)

  return buildServices(new Date())
}

/**
 * Loads one service. Stands in for `GET /services/:id`.
 *
 * @param id - Service id from the URL.
 * @param signal - Aborts the request.
 * @param delay - Simulated network time; tests pass 0.
 * @returns The service.
 * @throws {ServiceNotFoundError} When no service has that id.
 */
export async function fetchService(
  id: string,
  signal?: AbortSignal,
  delay = MOCK_NETWORK_DELAY_MS,
): Promise<Service> {
  const services = await fetchServices(signal, delay)
  const service = services.find((candidate) => candidate.id === id)
  if (!service) {
    throw new ServiceNotFoundError(id)
  }

  return service
}
