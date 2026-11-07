import { describe, expect, it } from 'vitest'
import { href, matchPattern, normalisePath, parseHash, resolveRoute } from './router.utils'

describe('parseHash', () => {
  it('treats an empty hash as the root', () => {
    expect(parseHash('').path).toBe('/')
    expect(parseHash('#').path).toBe('/')
  })

  it('separates the query', () => {
    const { path, query } = parseHash('#/report?service=search')
    expect(path).toBe('/report')
    expect(query.get('service')).toBe('search')
  })
})

describe('normalisePath', () => {
  it('adds a leading slash and drops trailing ones', () => {
    expect(normalisePath('report/')).toBe('/report')
    expect(normalisePath('/')).toBe('/')
  })
})

describe('matchPattern', () => {
  it('extracts and decodes params', () => {
    expect(matchPattern('/services/:id', '/services/media%20cdn')).toEqual({ id: 'media cdn' })
  })

  it('rejects different lengths and literals', () => {
    expect(matchPattern('/services/:id', '/services')).toBeNull()
    expect(matchPattern('/report', '/components')).toBeNull()
  })
})

describe('resolveRoute', () => {
  it.each([
    ['#/', 'overview'],
    ['#/services/search', 'service'],
    ['#/report?service=auth', 'report'],
    ['#/components', 'components'],
    ['#/nowhere', 'not-found'],
  ])('resolves %s to %s', (hash, name) => {
    expect(resolveRoute(hash).name).toBe(name)
  })
})

describe('href', () => {
  it('builds hash links with an optional query', () => {
    expect(href('/services/search')).toBe('#/services/search')
    expect(href('/report', { service: 'auth' })).toBe('#/report?service=auth')
  })
})
