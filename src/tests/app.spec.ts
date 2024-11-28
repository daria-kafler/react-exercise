import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mockNasaApiResponse } from "./mock/mockNasaApiResponse";
import { mockApi } from "./mock/mockApi";


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


// Test media type results displays - no more than 10 results appear in search
test("displays image results correctly", async ({ page }) => {
  // Go to the page, fill form, and submit
  await page.goto("/");
  await page.fill('input[name="keywords"]', "apollo");
  await page.selectOption('select[name="mediaType"]', "image");
  await page.click('button[type="submit"]');

  // Check for images in results (expect at least 1 and no more than 10)
  const imageResults = page.locator('img');
  const resultsCount = await imageResults.count();
  
  expect(resultsCount).toBeGreaterThan(0);  // At least 1 image
  expect(resultsCount).toBeLessThanOrEqual(10);  // No more than 10 images

  // Check if the first image is visible
  await expect(imageResults.nth(0)).toBeVisible();
});

test("displays audio results correctly", async ({ page }) => {
  // Go to the page, fill form, and submit
  await page.goto("/");
  await page.fill('input[name="keywords"]', "apollo");
  await page.selectOption('select[name="mediaType"]', "audio");
  await page.click('button[type="submit"]');

  // Check for images in results (expect at least 1 and no more than 10)
  await page.waitForSelector('audio', { timeout: 5000 });  // Wait for audio elements to appear
  const audioResults = page.locator('audio');
  const resultsCount = await audioResults.count();
  
  expect(resultsCount).toBeGreaterThan(0);  // At least 1 result
  expect(resultsCount).toBeLessThanOrEqual(10);  // No more than 10 results

  // Check if the first image is visible
  await expect(audioResults.nth(0)).toBeVisible();
});

test("displays video results correctly and video appears when thumbnails clicked", async ({ page }) => {
  // Go to the page, fill form, and submit
  await page.goto("/");
  await page.fill('input[name="keywords"]', "apollo");
  await page.selectOption('select[name="mediaType"]', "video");
  await page.click('button[type="submit"]');

  // Wait for thumbnail images to appear (expect at least 1 and no more than 10)
  await page.waitForSelector('img[aria-label="Play video"]', { timeout: 5000 }); // Wait for video thumbnail images to appear
  const videoThumbnails = page.locator('img[aria-label="Play video"]');
  const resultsCount = await videoThumbnails.count();

  expect(resultsCount).toBeGreaterThan(0);  // At least 1 result
  expect(resultsCount).toBeLessThanOrEqual(10);  // No more than 10 results

  // Check if the first thumbnail is visible
  await expect(videoThumbnails.nth(0)).toBeVisible();

  // Click the first thumbnail to load the video
  await videoThumbnails.nth(0).click();

  // Wait for the video element to appear after clicking the thumbnail
  const videoElement = page.locator('video');
  await expect(videoElement).toBeVisible();  // Ensure video is visible
});

// UNHAPPY PATHS
test.only("handles invalid image URL correctly", async ({ page }) => {
  // Mock the 'invalidImageUrl' scenario
  mockApi(page, 'invalidImageUrl');

  // Go to the page, fill form, and submit
  await page.goto("/");
  await page.fill('input[name="keywords"]', "lunar surface");
  await page.selectOption('select[name="mediaType"]', "image");
  await page.click('button[type="submit"]');

  // Wait for results to load - we expect 'Heading' to show up
  await page.locator('h2').nth(0).waitFor({ timeout: 10000 });

  // Check if image is visible and has an error
  const image = page.locator('img');
  await expect(image).not.toBeVisible();

  // Assert on error message or image error handling
  // Check for the fallback text message "Image preview not available"
  const errorMessage = page.locator('text=Image preview not available');
  await expect(errorMessage).toBeVisible();  // Ensure the fallback message is visible
});