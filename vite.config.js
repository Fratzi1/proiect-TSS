import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: "./src/setupTests.js",
    restoreMocks: true,
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['e2e/**', 'playwright.config.js'],
    browser: {
      provider: playwright(),
      enabled: false,
      instances: [
        { browser: 'chromium' },
      ],
    }
  },
})
