import { defineConfig, devices } from '@playwright/test';
import * as dotenv from "dotenv"
import path from 'path';
dotenv.config({ path: __dirname+'/config/.env' })

export const BASE_URL = `https://github.com/${process.env.OWNER}/${process.env.REPO_NAME}`
export const API_BASE_URL = `https://api.github.com/repos/${process.env.OWNER}/${process.env.REPO_NAME}`
export const STORAGE_STATE = path.join(__dirname,'.auth/user.json')

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list', { printSteps: true }], 
    ['html', { open: 'never' }], 
    ['junit', { outputFile: './reports/results.xml' }]
  ],
  timeout: 100000,
  use: {
    screenshot: 'only-on-failure',
    headless: process.env.CI ? true: false // used false for local debug
  },
  projects: [
    {
      name: 'setup',
      testDir: './setup',
      use: { 
        ...devices['Desktop Chrome'], 
        baseURL: 'https://github.com/'
      },
      
    },
    {
      name: 'e2e-tests',
      testMatch: '/e2e/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'], 
        baseURL: BASE_URL,
        storageState: STORAGE_STATE 
      },
      dependencies: ['setup']
    },

    {
      name: 'api-tests',
      testMatch: '/api/**/*.spec.ts',
      use: { 
        baseURL: API_BASE_URL
      },
    },
  ],
});
