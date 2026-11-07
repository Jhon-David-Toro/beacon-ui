import type { ChartBox, Extent, Point } from './Sparkline.types'

/**
 * Smallest and largest value of a series, widened to include an optional
 * reference value so a threshold line always fits in the chart.
 *
 * @param values - Data series.
 * @param reference - Extra value that must be inside the range.
 * @returns The range; `{ min: 0, max: 0 }` for an empty series.
 */
export function extentOf(values: readonly number[], reference?: number): Extent {
  const all = reference === undefined ? values : [...values, reference]
  if (all.length === 0) {
    return { min: 0, max: 0 }
  }

  return { min: Math.min(...all), max: Math.max(...all) }
}

/**
 * Maps a value to a vertical pixel position inside the box (SVG y grows down).
 *
 * @param value - Data value.
 * @param extent - Range of the series.
 * @param box - Chart dimensions.
 * @returns The y coordinate; the middle of the box for a flat series.
 */
export function scaleY(value: number, extent: Extent, box: ChartBox): number {
  const span = extent.max - extent.min
  const inner = box.height - box.padding * 2
  if (span === 0) {
    return box.height / 2
  }

  return box.padding + inner - ((value - extent.min) / span) * inner
}

/**
 * Converts a series into evenly spaced points that fill the box.
 *
 * @param values - Data series.
 * @param box - Chart dimensions.
 * @param extent - Range used for the vertical scale.
 * @returns One point per value, in the same order.
 */
export function toPoints(values: readonly number[], box: ChartBox, extent: Extent): Point[] {
  const step = values.length > 1 ? (box.width - box.padding * 2) / (values.length - 1) : 0

  return values.map((value, index) => ({
    x: round(box.padding + index * step),
    y: round(scaleY(value, extent, box)),
  }))
}

/**
 * SVG path data for a polyline through the points.
 *
 * @param points - Points in drawing order.
 * @returns The `d` attribute of the line.
 */
export function linePath(points: readonly Point[]): string {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`).join(' ')
}

/**
 * SVG path data for the area between the line and the bottom of the box.
 *
 * @param points - Points in drawing order.
 * @param box - Chart dimensions.
 * @returns The `d` attribute of the area, or an empty string with no points.
 */
export function areaPath(points: readonly Point[], box: ChartBox): string {
  const first = points[0]
  const last = points.at(-1)
  if (!first || !last) {
    return ''
  }
  const floor = box.height - box.padding

  return `${linePath(points)} L${last.x} ${floor} L${first.x} ${floor} Z`
}

/**
 * Plain-language summary of a series, used as the chart's accessible name.
 *
 * @param label - What the series measures.
 * @param values - Data series.
 * @param unit - Unit appended to each number.
 * @returns A sentence such as "Latency: latest 20ms, range 10ms to 30ms".
 */
export function describeSeries(label: string, values: readonly number[], unit: string): string {
  const last = values.at(-1)
  if (last === undefined) {
    return `${label}: no data`
  }
  const { min, max } = extentOf(values)

  return `${label}: latest ${format(last, unit)}, range ${format(min, unit)} to ${format(max, unit)}`
}

/**
 * Rounds to one decimal so path strings stay short and stable.
 *
 * @param value - Number to round.
 * @returns The rounded number.
 */
function round(value: number): number {
  return Math.round(value * 10) / 10
}

/**
 * Formats a number with its unit.
 *
 * @param value - Number to format.
 * @param unit - Unit suffix.
 * @returns The rounded number followed by the unit.
 */
function format(value: number, unit: string): string {
  return `${Math.round(value)}${unit}`
}
