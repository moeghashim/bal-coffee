import { defineConfig, devices } from "@playwright/test";

/**
 * GA4-on server. Separate dist directory so the client bundle is compiled with
 * NEXT_PUBLIC_GA_MEASUREMENT_ID instead of reusing the default `.next` cache.
 * The id is the public production measurement id so the view_item regression
 * can assert the g/collect `tid`. Specs fulfill those hits locally.
 */
const port = 3100;
const measurementId = "G-5DJRRRRNKC";

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
    // localhost, not 127.0.0.1. Next.js dev blocks cross-origin dev resources
    // when the browser host does not match the server host, which skips
    // hydration and never injects the afterInteractive gtag script.
    baseURL: `http://localhost:${port}`,
    trace: "on-first-retry",
    actionTimeout: 15_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `rm -rf .next-ga && pnpm dev --hostname localhost --port ${port}`,
    url: `http://localhost:${port}`,
    timeout: 180_000,
    reuseExistingServer: false,
    env: {
      NEXT_PUBLIC_GA_MEASUREMENT_ID: measurementId,
      NEXT_DIST_DIR: ".next-ga",
    },
  },
});
