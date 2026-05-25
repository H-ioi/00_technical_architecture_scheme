import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  test: {
    environment: 'jsdom',
    globals: false,
    include: ['src/__tests__/**/*.test.ts', 'src/__tests__/**/*.spec.ts'],
    exclude: ['node_modules', 'dist', 'coverage'],
    setupFiles: ['./src/__tests__/setup.ts'],
    testTimeout: 10000,
    hookTimeout: 10000,

    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'json', 'html', 'lcov'],
      include: ['src/utils/**/*.ts', 'src/composables/**/*.ts', 'src/views/**/*.ts'],
      exclude: ['**/*.d.ts', '**/__tests__/**', 'src/types/**']
    }
  }
})
