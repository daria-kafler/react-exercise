import { expect, test } from "@playwright/test";

test.describe("List Component Happy Path", () => {
  const mediaTypes = [
    { type: "image", selector: 'img[aria-label="Image preview"]' },
    { type: "video", selector: 'img[aria-label="Video preview thumbnail"]' },
    { type: "audio", selector: 'audio[aria-label="Audio preview"]' },
  ];

  mediaTypes.forEach(({ type, selector }) => {
    test(`displays ${type} results correctly`, async ({ page }) => {
      // Navigate to the home page and simulate a search
      await page.goto("/");
      await page.fill('input[name="keywords"]', "apollo");
      await page.selectOption('select[name="mediaType"]', type);
      await page.click('button[type="submit"]');

      // Wait for the loading state to disappear
      await expect(page.getByText("Loading...")).not.toBeVisible({ timeout: 10000 });

      // Wait for results to load
      await page.waitForSelector(selector, { timeout: 5000 });

      // Verify results
      const results = page.locator(selector);
      const resultsCount = await results.count();

      // Ensure there are 1 to 10 results
      expect(resultsCount).toBeGreaterThan(0);
      expect(resultsCount).toBeLessThanOrEqual(10);

      // Validate the title of the first result
      const firstTitle = page.locator("h2").first();
      await expect(firstTitle).toBeVisible();
      await expect(firstTitle).not.toBeEmpty();

      // Test modal if description exists
      const descriptionButton = page.locator('button:has-text("View Description")').first();
      if (await descriptionButton.isVisible()) {
        await descriptionButton.click();
        const modal = page.locator('[aria-label="Description Modal"]');
        await expect(modal).toBeVisible();
        await expect(modal.locator("p")).not.toBeEmpty();
        await modal.locator("button:has-text('Close')").click();
        await expect(modal).not.toBeVisible();
      }
    });
  });
});