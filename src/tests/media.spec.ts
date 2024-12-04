import { expect, test } from "@playwright/test";

test.describe("Media Component Happy Path", () => {
  // Test media type results displays - no more than 10 results appear in search
  test("displays image results correctly", async ({ page }) => {
    // Go to the page, fill form, and submit
    await page.goto("/");
    await page.fill('input[name="keywords"]', "shuttle");
    await page.selectOption('select[name="mediaType"]', "image");
    await page.click('button[type="submit"]');

    // Wait for the loading state to disappear
    await expect(page.getByText("Loading...")).not.toBeVisible({
      timeout: 10000,
    });
    // Check for images in results (expect at least 1 and no more than 10)
    const imageResults = page.locator("img");
    const resultsCount = await imageResults.count();

    expect(resultsCount).toBeGreaterThan(0); // At least 1 image
    expect(resultsCount).toBeLessThanOrEqual(10); // No more than 10 images

    // Check if the first image is visible
    await expect(imageResults.nth(0)).toBeVisible();
  });

  test("displays audio results correctly", async ({ page }) => {
    // Go to the page, fill form, and submit
    await page.goto("/");
    await page.fill('input[name="keywords"]', "apollo");
    await page.selectOption('select[name="mediaType"]', "audio");
    await page.click('button[type="submit"]');

    // Wait for the loading state to disappear
    await expect(page.getByText("Loading...")).not.toBeVisible({
      timeout: 30000,
    });

    // Check for audio elements in results
    const audioResults = page.locator("audio").first();
    await expect(audioResults).toBeVisible({ timeout: 10000 });

    // Scroll the first audio element into view (to account for Mobile Safari issues)
    await audioResults.first().scrollIntoViewIfNeeded();
    await expect(audioResults.first()).toBeVisible({ timeout: 10000 });

    // Check that we have the correct amount of results
    const resultsCount = await page.locator("audio").count();
    expect(resultsCount).toBeGreaterThan(0); // At least 1 result
    expect(resultsCount).toBeLessThanOrEqual(10); // No more than 10 results

    // Check if the first audio is visible
    await expect(audioResults.nth(0)).toBeVisible();
  });

  test("displays video results correctly and video appears when thumbnail clicked", async ({
    page,
  }) => {
    // Go to the page, fill form, and submit
    await page.goto("/");
    await page.fill('input[name="keywords"]', "apollo");
    await page.selectOption('select[name="mediaType"]', "video");
    await page.click('button[type="submit"]');

    // Wait for the loading state to disappear
    await expect(page.getByText("Loading...")).not.toBeVisible({
      timeout: 30000,
    });

    // Wait for thumbnail images to appear
    const videoThumbnails = page
      .locator('img[data-testid="video-thumbnail"]')
      .first();
    await expect(videoThumbnails).toBeVisible();

    // Check that we have the correct amount of results
    const resultsCount = await videoThumbnails.count();
    expect(resultsCount).toBeGreaterThan(0); // At least 1 result
    expect(resultsCount).toBeLessThanOrEqual(10); // No more than 10 results

    // Click the first thumbnail to load the video
    await videoThumbnails.click();

    // Wait for the video element to appear after clicking the thumbnail
    const videoElement = page.locator("video");
    await expect(videoElement).toBeVisible(); // Ensure video is visible
  });
});
