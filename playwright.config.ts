import { defineConfig, devices } from "@playwright/test";

/**
 * E2E config for the Bal Coffee storefront.
 *
 * This suite is the migration regression net (see HYDROGEN_MIGRATION.md): it is
 * authored against the CURRENT app and must stay green through the Hydrogen
 * toolkit migration and every subsequent upstream version bump.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  timeout: 45_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    actionTimeout: 15_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    timeout: 180_000,
    reuseExistingServer: !process.env.CI,
  },
});
