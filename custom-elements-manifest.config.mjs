export default {
  globs: ['src/design-system/components/**/*.ts'],
  exclude: [
    '**/*.test.ts',
    '**/*.styles.ts',
    '**/*.constants.ts',
    '**/*.types.ts',
    '**/*.utils.ts',
  ],
  outdir: '.',
  litelement: true,
}
