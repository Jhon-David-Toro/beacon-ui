import { describe, expect, it } from 'vitest'
import { ServiceNotFoundError, fetchService, fetchServices, wait } from './api'

describe('mock API', () => {
  it('lists the services', async () => {
    const services = await fetchServices(undefined, 0)
    expect(services.length).toBeGreaterThan(0)
  })

  it('loads one service by id', async () => {
    const service = await fetchService('search', undefined, 0)
    expect(service.name).toBe('Search')
  })

  it('rejects unknown ids with a typed error', async () => {
    await expect(fetchService('nope', undefined, 0)).rejects.toBeInstanceOf(ServiceNotFoundError)
  })

  it('stops waiting when the request is aborted', async () => {
    const controller = new AbortController()
    const pending = wait(10_000, controller.signal)
    controller.abort(new Error('Navigated away'))
    await expect(pending).rejects.toThrow('Navigated away')
  })

  it('rejects at once when already aborted', async () => {
    await expect(wait(10, AbortSignal.abort(new Error('gone')))).rejects.toThrow('gone')
  })
})
