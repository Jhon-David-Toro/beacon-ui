import { playwright } from '@vitest/browser-playwright'
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

/** Local Chrome to use instead of the Playwright download (CI leaves it unset). */
const executablePath = process.env.CHROME_PATH

export default mergeConfig(
  viteConfig,
  defineConfig({
    // Pre-bundled up front so Vite never reloads the test iframe mid-run.
    optimizeDeps: {
      include: [
        'lit',
        'lit/directives/class-map.js',
        'lit/directives/if-defined.js',
        'lit/directives/live.js',
        'lit/directives/repeat.js',
        'lit/directives/style-map.js',
        '@lit/context',
        '@lit/task',
        'axe-core',
      ],
    },
    test: {
      include: ['src/**/*.test.ts'],
      setupFiles: ['./src/test/setup.ts'],
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(executablePath ? { launchOptions: { executablePath } } : {}),
        instances: [{ browser: 'chromium' }],
      },
      coverage: {
        provider: 'v8',
        include: ['src/**/*.ts'],
        exclude: [
          'src/**/*.test.ts',
          'src/**/*.types.ts',
          'src/**/*.styles.ts',
          'src/**/index.ts',
          'src/main.ts',
          'src/test/**',
        ],
        reporter: ['text-summary', 'html', 'json-summary'],
      },
    },
  }),
)
