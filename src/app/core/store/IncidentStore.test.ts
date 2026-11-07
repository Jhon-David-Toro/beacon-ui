import { describe, expect, it, vi } from 'vitest'
import { IncidentStore } from './IncidentStore'
import { STORAGE_KEY } from './store.constants'
import type { IncidentReport } from './store.types'

const report: IncidentReport = {
  serviceId: 'search',
  title: 'Search results are slow',
  details: '',
  severity: 'degraded',
  notify: false,
}

/**
 * In-memory Storage stand-in.
 */
function memoryStorage(): Storage {
  const data = new Map<string, string>()
  return {
    get length() {
      return data.size
    },
    clear: () => {
      data.clear()
    },
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => data.delete(key),
    setItem: (key, value) => data.set(key, value),
  }
}

describe('IncidentStore', () => {
  it('adds a report as an investigating incident', () => {
    const store = new IncidentStore(null)
    const incident = store.report(report, new Date('2026-11-07T12:00:00Z'))
    expect(incident).toMatchObject({ phase: 'investigating', reportedByYou: true })
    expect(store.forService('search')).toEqual([incident])
    expect(store.forService('auth')).toEqual([])
  })

  it('notifies subscribers until they unsubscribe', () => {
    const store = new IncidentStore(null)
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)
    store.report(report)
    unsubscribe()
    store.report(report)
    expect(listener).toHaveBeenCalledOnce()
  })

  it('resolves an incident', () => {
    const store = new IncidentStore(null)
    const { id } = store.report(report)
    store.resolve(id)
    expect(store.incidents[0]?.phase).toBe('resolved')
  })

  it('persists reports and reads them back', () => {
    const storage = memoryStorage()
    new IncidentStore(storage).report(report)
    expect(new IncidentStore(storage).incidents).toHaveLength(1)
  })

  it('ignores corrupted storage', () => {
    const storage = memoryStorage()
    storage.setItem(STORAGE_KEY, '{not json')
    expect(new IncidentStore(storage).incidents).toEqual([])
  })

  it('keeps working when storage refuses to write', () => {
    const storage = memoryStorage()
    storage.setItem = () => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError')
    }
    const store = new IncidentStore(storage)
    store.report(report)
    expect(store.incidents).toHaveLength(1)
  })
})
