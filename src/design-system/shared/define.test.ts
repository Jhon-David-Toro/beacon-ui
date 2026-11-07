import { describe, expect, it } from 'vitest'
import { defineElement } from './define'

class FirstElement extends HTMLElement {}
class SecondElement extends HTMLElement {}

describe('defineElement', () => {
  it('registers the element under the given tag', () => {
    defineElement('bc-define-probe', FirstElement)
    expect(customElements.get('bc-define-probe')).toBe(FirstElement)
  })

  it('ignores a second registration of the same tag', () => {
    defineElement('bc-define-probe', SecondElement)
    expect(customElements.get('bc-define-probe')).toBe(FirstElement)
  })
})
