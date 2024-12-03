import { expect, test } from "@playwright/test";

test.describe("Media Component Happy Path", () => {
  // Test media type results displays - no more than 10 results appear in search
  test("displays image results correctly", async ({ page }) => {
    // Go to the page, fill form, and submit
    await page.goto("/");
    await page.fill('input[name="keywords"]', "shuttle");
    await page.selectOption('select[name="mediaType"]', "image");
    await page.click('button[type="submit"]');

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
    await page.fill('input[name="keywords"]', "shuttle");
    await page.selectOption('select[name="mediaType"]', "audio");
    await page.click('button[type="submit"]');

    // Check for images in results (expect at least 1 and no more than 10)
    await page.waitForSelector("audio", { timeout: 5000 }); // Wait for audio elements to appear
    const audioResults = page.locator("audio");
    const resultsCount = await audioResults.count();

    expect(resultsCount).toBeGreaterThan(0); // At least 1 result
    expect(resultsCount).toBeLessThanOrEqual(10); // No more than 10 results

    // Check if the first image is visible
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

    // Wait for thumbnail images to appear (expect at least 1 and no more than 10)
    await page.waitForSelector('img[aria-label="Video preview thumbnail"]', {
      timeout: 5000,
    });
    const videoThumbnails = page.locator(
      'img[aria-label="Video preview thumbnail"]',
    );
    const resultsCount = await videoThumbnails.count();

    expect(resultsCount).toBeGreaterThan(0); // At least 1 result
    expect(resultsCount).toBeLessThanOrEqual(10); // No more than 10 results

    // Check if the first thumbnail is visible
    await expect(videoThumbnails.nth(0)).toBeVisible();

    // Click the first thumbnail to load the video
    await videoThumbnails.nth(0).click();

    // Wait for the video element to appear after clicking the thumbnail
    const videoElement = page.locator("video");
    await expect(videoElement).toBeVisible(); // Ensure video is visible
  });
});
