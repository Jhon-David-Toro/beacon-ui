import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fixture, shadowQuery } from '../../../test/fixture'
import './Toast'
import type { BcToastRegion } from './Toast'
import { dequeue, enqueue } from './Toast.utils'

/**
 * Messages currently rendered by the region.
 *
 * @param el - Toast region.
 */
function messages(el: BcToastRegion): string[] {
  return [...(el.shadowRoot?.querySelectorAll('.message') ?? [])].map((node) => node.textContent)
}

describe('bc-toast-region', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('is a polite live region from the start', async () => {
    const el = await fixture<BcToastRegion>('<bc-toast-region></bc-toast-region>')
    const region = shadowQuery(el, 'ol')
    expect(region.getAttribute('role')).toBe('status')
    expect(region.getAttribute('aria-live')).toBe('polite')
  })

  it('shows a message and removes it after its duration', async () => {
    const el = await fixture<BcToastRegion>('<bc-toast-region></bc-toast-region>')
    el.show({ message: 'Incident reported', tone: 'success', duration: 1000 })
    await el.updateComplete
    expect(messages(el)).toEqual(['Incident reported'])
    vi.advanceTimersByTime(1000)
    await el.updateComplete
    expect(messages(el)).toEqual([])
  })

  it('dismisses a toast early', async () => {
    const el = await fixture<BcToastRegion>('<bc-toast-region></bc-toast-region>')
    const id = el.show({ message: 'Copied' })
    el.dismiss(id)
    await el.updateComplete
    expect(messages(el)).toEqual([])
  })

  it('keeps at most three toasts on screen', async () => {
    const el = await fixture<BcToastRegion>('<bc-toast-region></bc-toast-region>')
    ;['one', 'two', 'three', 'four'].forEach((message) => el.show({ message }))
    await el.updateComplete
    expect(messages(el)).toEqual(['two', 'three', 'four'])
  })
})

describe('toast queue', () => {
  const item = (id: number) => ({ id, message: String(id), tone: 'neutral' as const })

  it('drops the oldest items past the limit', () => {
    expect(enqueue([item(1), item(2)], item(3), 2).map((toast) => toast.id)).toEqual([2, 3])
  })

  it('removes an item by id', () => {
    expect(dequeue([item(1), item(2)], 1).map((toast) => toast.id)).toEqual([2])
  })
})
