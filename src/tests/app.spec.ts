import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mockApi } from "./mocks/mockApi";

test.beforeEach(async ({ page }) => {
  // Default mock scenario for successful API response
  mockApi(page, 'default');
});

test.afterEach(async ({ page }) => {
  await page.context().clearCookies(); // Clean up any cookies set during the test
  await page.evaluate(() => localStorage.clear());
  await page.evaluate(() => sessionStorage.clear());
});


test.describe("HomePage tests", () => {
  test("can view homepage correctly without and accessibility errors", async ({
    page,
  }) => {
    await page.goto(`/`);
    await expect(page.locator('h1:has-text("React Exercise")')).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include("main")
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});


