import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 20000,
  },
  use: {
    headless: false,
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  reporter: [['line'], ['allure-playwright']],
})
