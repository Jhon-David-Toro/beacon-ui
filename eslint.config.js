import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'
import jsdoc from 'eslint-plugin-jsdoc'
import lit from 'eslint-plugin-lit'
import litA11y from 'eslint-plugin-lit-a11y'
import sonarjs from 'eslint-plugin-sonarjs'
import wc from 'eslint-plugin-wc'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { METRICS, TEST_METRICS } from './metrics.config.js'

/** Every declaration that must carry a JSDoc block. */
const DOCUMENTED = [
  'ClassDeclaration',
  'FunctionDeclaration',
  'MethodDefinition',
  'PropertyDefinition',
  'TSInterfaceDeclaration',
  'TSTypeAliasDeclaration',
  'TSInterfaceBody > TSPropertySignature',
  'TSInterfaceBody > TSMethodSignature',
  'Program > VariableDeclaration',
  'ExportNamedDeclaration:has(> VariableDeclaration)',
]

/** Tags used by Lit and the Custom Elements Manifest analyzer. */
const COMPONENT_TAGS = ['tag', 'slot', 'fires', 'csspart', 'cssprop', 'attr', 'summary']

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'custom-elements.json', 'node_modules', '.metrics']),
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  lit.configs['flat/recommended'],
  wc.configs['flat/best-practice'],
  jsdoc.configs['flat/recommended-typescript-error'],
  {
    plugins: { 'lit-a11y': litA11y, sonarjs, '@stylistic': stylistic },
    rules: litA11y.configs.recommended.rules,
  },
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    settings: { jsdoc: { mode: 'typescript' } },
    rules: {
      // Code metrics. Limits live in metrics.config.js.
      complexity: ['error', METRICS.cyclomaticComplexity],
      'sonarjs/cognitive-complexity': ['error', METRICS.cognitiveComplexity],
      'max-depth': ['error', METRICS.maxDepth],
      'max-params': ['error', METRICS.maxParams],
      'max-statements': ['error', METRICS.maxStatements],
      'max-nested-callbacks': ['error', METRICS.maxNestedCallbacks],
      'max-lines-per-function': [
        'error',
        { max: METRICS.maxLinesPerFunction, skipBlankLines: true, skipComments: true },
      ],
      'max-lines': [
        'error',
        { max: METRICS.maxLinesPerFile, skipBlankLines: true, skipComments: true },
      ],
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-duplicated-branches': 'error',
      'sonarjs/no-collapsible-if': 'error',

      // Documentation: every declaration, property and type has JSDoc.
      'jsdoc/require-jsdoc': [
        'error',
        { publicOnly: false, require: { FunctionDeclaration: false }, contexts: DOCUMENTED },
      ],
      'jsdoc/require-description': ['error', { contexts: DOCUMENTED }],
      'jsdoc/require-throws': 'error',
      'jsdoc/check-tag-names': ['error', { definedTags: COMPONENT_TAGS }],
      'jsdoc/tag-lines': ['error', 'never', { startLines: 1 }],

      // Layout: one blank line between class members, and before returns.
      '@stylistic/lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: false },
      ],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
      ],

      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      'lit/no-template-arrow': 'error',
      'lit/no-this-assign-in-render': 'error',
      'lit/no-native-attributes': 'error',
      'wc/guard-super-call': 'off',
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      'max-lines-per-function': [
        'error',
        { max: TEST_METRICS.maxLinesPerFunction, skipBlankLines: true, skipComments: true },
      ],
      'max-statements': ['error', TEST_METRICS.maxStatements],
      'max-nested-callbacks': ['error', TEST_METRICS.maxNestedCallbacks],
    },
  },
  {
    files: ['*.js', '*.mjs', 'scripts/**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node },
  },
])
