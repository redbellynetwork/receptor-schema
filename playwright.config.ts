import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./test/",
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'github' : 'line',
  timeout: 60000, // Increase timeout to 60 seconds
});
