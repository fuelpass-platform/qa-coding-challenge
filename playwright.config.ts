import { defineConfig, devices } from '@playwright/test';

const backendUrl = 'http://127.0.0.1:3001/api';
const frontendUrl = 'http://127.0.0.1:5173';

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
      command: 'npm run dev --workspace @fuelpass/frontend -- --host 127.0.0.1',
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
        baseURL: 'http://127.0.0.1:3001',
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
