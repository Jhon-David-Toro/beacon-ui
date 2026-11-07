import { describe, expect, it } from 'vitest'
import { preselectedService, serviceName } from './ReportView.utils'

describe('serviceName', () => {
  it('returns the display name, or the id when unknown', () => {
    expect(serviceName('search')).toBe('Search')
    expect(serviceName('mystery')).toBe('mystery')
  })
})

describe('preselectedService', () => {
  it('only preselects services that exist', () => {
    expect(preselectedService('auth')).toBe('auth')
    expect(preselectedService('nope')).toBe('')
  })
})
