/**
 * Custom Elements Manifest analyzer settings. `pnpm analyze` writes
 * `custom-elements.json`, which editors and docs tools read to show every
 * element's attributes, properties, events, slots and CSS parts.
 */
export default {
  /** Components and the base classes they extend, so inherited props are listed. */
  globs: ['src/design-system/components/**/*.ts', 'src/design-system/shared/form-control/*.ts'],

  /** Files without element classes. */
  exclude: ['**/*.test.ts', '**/*.constants.ts', '**/*.types.ts', '**/*.utils.ts', '**/index.ts'],

  /** Write the manifest at the project root. */
  outdir: '.',

  /** Understand Lit's `static properties`. */
  litelement: true,
}
