import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import lit from 'eslint-plugin-lit'
import litA11y from 'eslint-plugin-lit-a11y'
import wc from 'eslint-plugin-wc'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'custom-elements.json', 'node_modules']),
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  lit.configs['flat/recommended'],
  wc.configs['flat/best-practice'],
  {
    plugins: { 'lit-a11y': litA11y },
    rules: litA11y.configs.recommended.rules,
  },
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      // Same metric and threshold as the VS Code "Code Metrics" extension.
      complexity: ['warn', 10],
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
    files: ['*.js', '*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
  },
])
