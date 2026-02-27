import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '.env') });

// ---- Build date & time folders ----
const now = new Date();
const dateFolder = now.toISOString().split('T')[0]; // YYYY-MM-DD
const HH = String(now.getHours()).padStart(2, '0');
const mm = String(now.getMinutes()).padStart(2, '0');
const ss = String(now.getSeconds()).padStart(2, '0');
const timeStamp = `${HH}-${mm}-${ss}`;               // HH-mm-ss

const baseResultsDir = path.join('test-results', dateFolder);
const allureResultsDir = path.join(baseResultsDir, `allure-results-${timeStamp}`);
fs.mkdirSync(allureResultsDir, { recursive: true });

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',

  // HTML + Allure reporters
  reporter: [
    ['html'],
    ['allure-playwright', { outputFolder: allureResultsDir, detail: true, suiteTitle: false }],
  ],

  // Keep CI stable; parallel locally
  workers: isCI ? 1 : undefined, // Playwright recommends 1 worker on CI for stability [1](https://github.com/faker-js/faker/issues/3606)

  use: {
    baseURL: process.env.BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // 👇 Key fix: always headless on CI (headed locally for debugging)
    headless: false,  // CI needs headless to avoid X server issues [1](https://github.com/faker-js/faker/issues/3606)

    launchOptions: { args: ['--disable-features=Autofill'] },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});