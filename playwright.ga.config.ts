import { defineConfig, devices } from "@playwright/test";

/**
 * GA4-on server. Separate dist directory so the client bundle is compiled with
 * NEXT_PUBLIC_GA_MEASUREMENT_ID instead of reusing the default `.next` cache.
 * The id is a test double, not a production property.
 */
const port = 3100;
const measurementId = "G-TESTBAL01";

export default defineConfig({
  testDir: "./e2e-ga",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI
    ? [["github"], ["list"], ["html", { open: "never" }]]
    : "list",
  timeout: 60_000,
  expect: { timeout: 20_000 },
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "on-first-retry",
    actionTimeout: 15_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `pnpm dev --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    timeout: 180_000,
    reuseExistingServer: false,
    env: {
      NEXT_PUBLIC_GA_MEASUREMENT_ID: measurementId,
      NEXT_DIST_DIR: ".next-ga",
    },
  },
});
