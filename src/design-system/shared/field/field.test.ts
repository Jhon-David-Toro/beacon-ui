import { describe, expect, it } from 'vitest'
import { describedBy } from './field'

describe('describedBy', () => {
  it('points at the message when there is a hint or an error', () => {
    expect(describedBy({ hint: 'Shown to subscribers', error: '' })).toBe('message')
    expect(describedBy({ hint: '', error: 'Required' })).toBe('message')
  })

  it('is undefined when there is nothing to describe', () => {
    expect(describedBy({ hint: '', error: '' })).toBeUndefined()
  })
})
