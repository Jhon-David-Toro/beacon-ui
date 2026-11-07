import { describe, expect, it } from 'vitest'
import { applyTheme, initialTheme, isTheme } from './theme.utils'

describe('initialTheme', () => {
  it('prefers the saved choice', () => {
    expect(initialTheme('light', true)).toBe('light')
  })

  it('falls back to the system setting', () => {
    expect(initialTheme(null, true)).toBe('dark')
    expect(initialTheme('sepia', false)).toBe('light')
  })
})

describe('isTheme', () => {
  it('accepts only known themes', () => {
    expect(isTheme('dark')).toBe(true)
    expect(isTheme('blue')).toBe(false)
  })
})

describe('applyTheme', () => {
  it('sets the theme on the root element', () => {
    applyTheme('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    applyTheme('light')
  })
})
