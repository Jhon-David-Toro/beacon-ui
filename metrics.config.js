/**
 * Code metric limits for every function in the project.
 *
 * This file is the single source of truth: ESLint enforces these values
 * (`pnpm lint`) and the metrics report checks and prints them
 * (`pnpm metrics`). Change a limit here and both follow.
 *
 * @type {Readonly<{
 *   cyclomaticComplexity: number,
 *   cognitiveComplexity: number,
 *   maxDepth: number,
 *   maxParams: number,
 *   maxLinesPerFunction: number,
 *   maxStatements: number,
 *   maxLinesPerFile: number,
 *   maxNestedCallbacks: number
 * }>}
 */
export const METRICS = Object.freeze({
  /** Independent paths through a function (branches + 1). Same metric as VS Code "Code Metrics". */
  cyclomaticComplexity: 10,

  /** How hard a function is to read: nesting makes each branch cost more. */
  cognitiveComplexity: 10,

  /** Deepest nesting of blocks (if, loops, try) inside one function. */
  maxDepth: 3,

  /** Parameters per function. More than this calls for an options object. */
  maxParams: 3,

  /** Lines of code per function, without blank lines or comments. */
  maxLinesPerFunction: 50,

  /** Statements per function. */
  maxStatements: 15,

  /** Lines of code per file, without blank lines or comments. */
  maxLinesPerFile: 300,

  /** Callbacks nested inside callbacks. */
  maxNestedCallbacks: 3,
})

/**
 * Looser limits for test files, where `describe` and `it` callbacks are long
 * and nested by design. Complexity limits still apply.
 *
 * @type {Readonly<{ maxLinesPerFunction: number, maxStatements: number, maxNestedCallbacks: number }>}
 */
export const TEST_METRICS = Object.freeze({
  /** Lines per function: a `describe` block holds many tests. */
  maxLinesPerFunction: 200,

  /** Statements per function. */
  maxStatements: 25,

  /** `describe` → `it` → `expect.poll` callbacks. */
  maxNestedCallbacks: 4,
})
