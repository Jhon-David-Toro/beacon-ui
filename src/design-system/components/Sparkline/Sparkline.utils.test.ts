import { describe, expect, it } from 'vitest'
import { areaPath, describeSeries, extentOf, linePath, scaleY, toPoints } from './Sparkline.utils'

/** 100 × 20 box without padding, so expected coordinates are easy to read. */
const box = { width: 100, height: 20, padding: 0 }

describe('extentOf', () => {
  it('returns the min and max of the series', () => {
    expect(extentOf([4, 1, 9])).toEqual({ min: 1, max: 9 })
  })

  it('widens the range to include the reference value', () => {
    expect(extentOf([4, 6], 10)).toEqual({ min: 4, max: 10 })
  })

  it('returns a zero range for an empty series', () => {
    expect(extentOf([])).toEqual({ min: 0, max: 0 })
  })
})

describe('scaleY', () => {
  it('puts the maximum at the top and the minimum at the bottom', () => {
    const extent = { min: 0, max: 10 }
    expect(scaleY(10, extent, box)).toBe(0)
    expect(scaleY(0, extent, box)).toBe(20)
  })

  it('centres a flat series', () => {
    expect(scaleY(5, { min: 5, max: 5 }, box)).toBe(10)
  })
})

describe('toPoints and paths', () => {
  const points = toPoints([0, 10, 5], box, { min: 0, max: 10 })

  it('spreads the points across the full width', () => {
    expect(points).toEqual([
      { x: 0, y: 20 },
      { x: 50, y: 0 },
      { x: 100, y: 10 },
    ])
  })

  it('draws a polyline through every point', () => {
    expect(linePath(points)).toBe('M0 20 L50 0 L100 10')
  })

  it('closes the area along the bottom edge', () => {
    expect(areaPath(points, box)).toBe('M0 20 L50 0 L100 10 L100 20 L0 20 Z')
  })

  it('returns an empty area for no points', () => {
    expect(areaPath([], box)).toBe('')
  })

  it('places a single point at the left padding', () => {
    expect(toPoints([3], box, { min: 3, max: 3 })).toEqual([{ x: 0, y: 10 }])
  })
})

describe('describeSeries', () => {
  it('summarises the latest value and the range', () => {
    expect(describeSeries('Latency', [120.4, 80, 200], 'ms')).toBe(
      'Latency: latest 200ms, range 80ms to 200ms',
    )
  })

  it('says when there is no data', () => {
    expect(describeSeries('Latency', [], 'ms')).toBe('Latency: no data')
  })
})
