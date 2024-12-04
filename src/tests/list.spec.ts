import { expect, test } from "@playwright/test";

test.describe("List Component Happy Path", () => {
  const mediaTypes = [
    { type: "image", selector: 'img[data-testid="image-component"]' },
    { type: "video", selector: 'img[data-testid="video-thumbnail"]' },
    { type: "audio", selector: 'audio[data-testid="audio-component"]' },
  ];

  mediaTypes.forEach(({ type, selector }) => {
    test(`displays ${type} results correctly`, async ({ page }) => {
      // Navigate to the home page and simulate a search
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");
      await page.fill('input[name="keywords"]', "apollo");
      await page.selectOption('select[name="mediaType"]', type);
      await page.click('button[type="submit"]');

      // Wait for the loading state to disappear
      await expect(page.getByText("Loading...")).not.toBeVisible({
        timeout: 30000,
      });

      // Results should be visible without needing to scroll
      const resultsHeading = page.getByRole("heading", { level: 2 }).first();
      await expect(resultsHeading).toBeVisible({ timeout: 30000 });
      await expect(resultsHeading).not.toBeEmpty();

      // Verify results
      const resultsCount = await page.locator(selector).count();

      // Ensure there are 1 to 10 results
      expect(resultsCount).toBeGreaterThan(0);
      expect(resultsCount).toBeLessThanOrEqual(10);
    });
  });
});
