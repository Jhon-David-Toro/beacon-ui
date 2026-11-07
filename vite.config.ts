import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  css: {
    preprocessorOptions: {
      // Deprecated Sass features fail the build instead of printing a warning.
      scss: { fatalDeprecations: ['import', 'global-builtin'] },
    },
  },
  build: { target: 'es2023', sourcemap: true },
})
