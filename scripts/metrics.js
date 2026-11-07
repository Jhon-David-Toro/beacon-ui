/**
 * Code metrics report: measures every function in `src/` and checks it
 * against the limits in `metrics.config.js`.
 *
 * Usage:
 *   pnpm metrics                       print the report, exit 1 on any violation
 *   pnpm metrics --markdown <file>     also write the report as Markdown
 *   pnpm metrics --json <file>         also write every measured function as JSON
 *
 * Cyclomatic complexity follows ESLint's `complexity` rule: 1 plus one per
 * `if`, ternary, loop, `case`, `catch`, `&&`, `||`, `??`, logical
 * assignment, optional chain (`?.`) and default value in parameters or
 * destructuring. Nested functions are measured on their own. ESLint stays the
 * gate in CI; this script shows the numbers behind it, like the VS Code
 * "Code Metrics" extension does in the editor.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import ts from 'typescript'
import { METRICS, TEST_METRICS } from '../metrics.config.js'

/**
 * Measurements of one function.
 *
 * @typedef {object} FunctionMetrics
 * @property {string} file - Path relative to the project root.
 * @property {number} line - 1-based line where the function starts.
 * @property {string} name - Readable name, such as `BcTabs.#select`.
 * @property {number} complexity - Cyclomatic complexity.
 * @property {number} lines - Lines of code, without blank lines or comments.
 * @property {number} params - Number of parameters.
 * @property {number} depth - Deepest block nesting.
 * @property {boolean} test - Whether the function is in a test file.
 */

/**
 * A limit a function goes over.
 *
 * @typedef {object} Violation
 * @property {FunctionMetrics} fn - The function.
 * @property {string} metric - Name of the metric.
 * @property {number} value - Measured value.
 * @property {number} limit - Allowed maximum.
 */

/** Folder that is measured. */
const SOURCE_DIR = 'src'

/** Syntax kinds that add one independent path. */
const BRANCH_KINDS = new Set([
  ts.SyntaxKind.IfStatement,
  ts.SyntaxKind.ConditionalExpression,
  ts.SyntaxKind.ForStatement,
  ts.SyntaxKind.ForInStatement,
  ts.SyntaxKind.ForOfStatement,
  ts.SyntaxKind.WhileStatement,
  ts.SyntaxKind.DoStatement,
  ts.SyntaxKind.CatchClause,
  ts.SyntaxKind.CaseClause,
])

/** Binary operators that short-circuit, and so add a path. */
const BRANCH_OPERATORS = new Set([
  ts.SyntaxKind.AmpersandAmpersandToken,
  ts.SyntaxKind.BarBarToken,
  ts.SyntaxKind.QuestionQuestionToken,
  ts.SyntaxKind.AmpersandAmpersandEqualsToken,
  ts.SyntaxKind.BarBarEqualsToken,
  ts.SyntaxKind.QuestionQuestionEqualsToken,
])

/** Statements that open a nesting level. */
const NESTING_KINDS = new Set([
  ts.SyntaxKind.IfStatement,
  ts.SyntaxKind.ForStatement,
  ts.SyntaxKind.ForInStatement,
  ts.SyntaxKind.ForOfStatement,
  ts.SyntaxKind.WhileStatement,
  ts.SyntaxKind.DoStatement,
  ts.SyntaxKind.TryStatement,
  ts.SyntaxKind.SwitchStatement,
])

/**
 * Every `.ts` file under a folder, skipping declaration files.
 *
 * @param dir - Folder to walk.
 * @returns File paths.
 */
function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      return listFiles(path)
    }

    return entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts') ? [path] : []
  })
}

/**
 * Whether a node is a function, method, accessor or constructor.
 *
 * @param node - Node to test.
 * @returns `true` for anything with its own body of code.
 */
function isFunctionLike(node) {
  return ts.isFunctionLike(node) && 'body' in node && node.body !== undefined
}

/**
 * Whether a node adds a path to the function it belongs to.
 *
 * @param node - Node inside a function body.
 * @returns `true` for branches, short-circuit operators, optional chains and defaults.
 */
function isBranch(node) {
  if ('questionDotToken' in node && node.questionDotToken) {
    return true
  }
  if ((ts.isParameter(node) || ts.isBindingElement(node)) && node.initializer) {
    return true
  }
  if (ts.isBinaryExpression(node)) {
    return BRANCH_OPERATORS.has(node.operatorToken.kind)
  }

  return BRANCH_KINDS.has(node.kind)
}

/**
 * Cyclomatic complexity of one function, not counting nested functions.
 *
 * @param fn - Function node.
 * @returns 1 plus the number of branches.
 */
function complexityOf(fn) {
  let total = 1
  const visit = (node) => {
    if (node !== fn && isFunctionLike(node)) {
      return
    }
    if (isBranch(node)) {
      total += 1
    }
    ts.forEachChild(node, visit)
  }
  ts.forEachChild(fn, visit)

  return total
}

/**
 * Deepest nesting of blocks inside a function, not counting nested functions.
 *
 * @param fn - Function node.
 * @returns 0 for a flat function.
 */
function depthOf(fn) {
  let deepest = 0
  const visit = (node, depth) => {
    if (node !== fn && isFunctionLike(node)) {
      return
    }
    const inner = NESTING_KINDS.has(node.kind) ? depth + 1 : depth
    deepest = Math.max(deepest, inner)
    ts.forEachChild(node, (child) => {
      visit(child, inner)
    })
  }
  visit(fn, 0)

  return deepest
}

/**
 * Lines of code a node spans, without blank lines and comments.
 *
 * @param node - Node to measure.
 * @param source - File the node belongs to.
 * @returns The line count.
 */
function linesOf(node, source) {
  const text = node.getText(source).replace(/\/\*[\s\S]*?\*\//g, '')

  return text.split('\n').filter((line) => {
    const trimmed = line.trim()

    return trimmed !== '' && !trimmed.startsWith('//')
  }).length
}

/**
 * Name written on the function itself, if any.
 *
 * @param fn - Function node.
 * @returns The name, `constructor`, or `undefined` for anonymous functions.
 */
function ownName(fn) {
  if (ts.isConstructorDeclaration(fn)) {
    return 'constructor'
  }

  return fn.name ? fn.name.getText() : undefined
}

/**
 * Name of the variable or class field a function is assigned to.
 *
 * @param fn - Function node.
 * @returns The name, or `undefined` when the function is not assigned.
 */
function assignedName(fn) {
  const holder = fn.parent
  const assigned = ts.isVariableDeclaration(holder) || ts.isPropertyDeclaration(holder)

  return assigned ? holder.name.getText() : undefined
}

/**
 * Readable name of a function: `Class.method`, the variable it is assigned
 * to, or `<anonymous>`.
 *
 * @param fn - Function node.
 * @returns The name.
 */
function nameOf(fn) {
  const member = ownName(fn) ?? assignedName(fn)
  if (!member) {
    return '<anonymous>'
  }
  const owner = ts.findAncestor(fn, ts.isClassLike)

  return owner?.name ? `${owner.name.getText()}.${member}` : member
}

/**
 * Measures every function in one file.
 *
 * @param path - File path.
 * @returns One entry per function.
 */
function measureFile(path) {
  const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true)
  const file = relative(process.cwd(), path)
  const test = file.endsWith('.test.ts')
  const found = []
  const visit = (node) => {
    if (isFunctionLike(node)) {
      found.push({
        file,
        line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1,
        name: nameOf(node),
        complexity: complexityOf(node),
        lines: linesOf(node, source),
        params: node.parameters.length,
        depth: depthOf(node),
        test,
      })
    }
    ts.forEachChild(node, visit)
  }
  visit(source)

  return found
}

/**
 * Limits that apply to a function: test files allow longer functions.
 *
 * @param fn - Measured function.
 * @returns Pairs of metric key, measured value and limit.
 */
function limitsFor(fn) {
  return [
    ['complexity', fn.complexity, METRICS.cyclomaticComplexity],
    ['params', fn.params, METRICS.maxParams],
    ['depth', fn.depth, METRICS.maxDepth],
    ['lines', fn.lines, fn.test ? TEST_METRICS.maxLinesPerFunction : METRICS.maxLinesPerFunction],
  ]
}

/**
 * Every limit any function goes over.
 *
 * @param functions - Measured functions.
 * @returns The violations, worst first.
 */
function findViolations(functions) {
  return functions
    .flatMap((fn) =>
      limitsFor(fn)
        .filter(([, value, limit]) => value > limit)
        .map(([metric, value, limit]) => ({ fn, metric, value, limit })),
    )
    .sort((a, b) => b.value / b.limit - a.value / a.limit)
}

/**
 * Totals for the summary line.
 *
 * @param functions - Measured functions.
 * @param fileCount - Number of files measured.
 * @returns Counts and complexity statistics.
 */
function summarise(functions, fileCount) {
  const source = functions.filter((fn) => !fn.test)
  const complexities = source.map((fn) => fn.complexity)
  const average = complexities.reduce((sum, value) => sum + value, 0) / complexities.length

  return {
    files: fileCount,
    functions: source.length,
    testFunctions: functions.length - source.length,
    averageComplexity: Math.round(average * 100) / 100,
    maxComplexity: Math.max(...complexities),
    maxLines: Math.max(...source.map((fn) => fn.lines)),
    maxParams: Math.max(...source.map((fn) => fn.params)),
    maxDepth: Math.max(...source.map((fn) => fn.depth)),
  }
}

/**
 * Markdown table of the most complex source functions.
 *
 * @param functions - Measured functions.
 * @param count - Rows to show.
 * @returns The table, one string per line.
 */
function topTable(functions, count) {
  const rows = functions
    .filter((fn) => !fn.test)
    .sort((a, b) => b.complexity - a.complexity || b.lines - a.lines)
    .slice(0, count)
    .map(
      (fn) =>
        `| \`${fn.name}\` | ${fn.file}:${fn.line} | ${fn.complexity} | ${fn.lines} | ${fn.params} | ${fn.depth} |`,
    )

  return [
    '| Function | Location | Complexity | Lines | Params | Depth |',
    '| --- | --- | ---: | ---: | ---: | ---: |',
    ...rows,
  ]
}

/**
 * The full report as Markdown.
 *
 * @param summary - Totals from `summarise`.
 * @param functions - Measured functions.
 * @param violations - Limits exceeded.
 * @returns The report text.
 */
function renderReport(summary, functions, violations) {
  const status =
    violations.length === 0
      ? 'Every function is within the limits.'
      : `${violations.length} violations.`

  return [
    '# Code metrics',
    '',
    'Generated by `pnpm metrics`. Limits come from `metrics.config.js`; ESLint enforces the same values on every commit.',
    '',
    '| Metric | Limit | Highest in `src` |',
    '| --- | ---: | ---: |',
    `| Cyclomatic complexity | ${METRICS.cyclomaticComplexity} | ${summary.maxComplexity} |`,
    `| Lines per function | ${METRICS.maxLinesPerFunction} | ${summary.maxLines} |`,
    `| Parameters | ${METRICS.maxParams} | ${summary.maxParams} |`,
    `| Nesting depth | ${METRICS.maxDepth} | ${summary.maxDepth} |`,
    '',
    `${summary.files} files, ${summary.functions} functions (plus ${summary.testFunctions} in tests), average complexity ${summary.averageComplexity}. ${status}`,
    '',
    'Cognitive complexity (limit ' +
      METRICS.cognitiveComplexity +
      '), statements per function (limit ' +
      METRICS.maxStatements +
      ') and lines per file (limit ' +
      METRICS.maxLinesPerFile +
      ') are checked by ESLint.',
    '',
    '## Most complex functions',
    '',
    ...topTable(functions, 15),
    '',
    ...violations.map(
      (v) =>
        `- **${v.fn.name}** (${v.fn.file}:${v.fn.line}): ${v.metric} ${v.value}, limit ${v.limit}`,
    ),
  ].join('\n')
}

/**
 * Value that follows a flag on the command line.
 *
 * @param args - Command-line arguments.
 * @param flag - Flag such as `--json`.
 * @returns The value, or `undefined` when the flag is missing.
 */
function option(args, flag) {
  const index = args.indexOf(flag)

  return index === -1 ? undefined : args[index + 1]
}

/**
 * Runs the report and sets the exit code.
 *
 * @param args - Command-line arguments.
 */
function main(args) {
  const files = listFiles(SOURCE_DIR)
  const functions = files.flatMap(measureFile)
  const violations = findViolations(functions)
  const report = renderReport(summarise(functions, files.length), functions, violations)
  const markdown = option(args, '--markdown')
  if (markdown) {
    writeFileSync(markdown, `${report}\n`)
  }
  const json = option(args, '--json')
  if (json) {
    writeFileSync(json, `${JSON.stringify(functions, null, 2)}\n`)
  }
  console.log(report)
  process.exitCode = violations.length === 0 ? 0 : 1
}

main(process.argv.slice(2))
