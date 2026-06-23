import { defineConfig, devices } from '@playwright/test';

const backendUrl = 'http://localhost:3001/api';
const frontendUrl = 'http://localhost:5173';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    baseURL: frontendUrl,
  },
  webServer: [
    {
      command: 'npm run start --workspace @fuelpass/backend',
      url: `${backendUrl}/reference`,
      timeout: 120_000,
      reuseExistingServer: false,
    },
    {
      command: 'npm run dev --workspace @fuelpass/frontend -- --host localhost',
      url: frontendUrl,
      timeout: 120_000,
      reuseExistingServer: false,
    },
  ],
  projects: [
    {
      name: 'api',
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        baseURL: 'http://localhost:3001',
      },
    },
    {
      name: 'chromium',
      testMatch: /.*\.ui\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: frontendUrl,
      },
    },
  ],
});
