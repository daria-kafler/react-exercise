import { test, expect, type Page } from "@playwright/test";

// Utility to navigate and trigger a search
async function setupSearch(page: Page, keywords = "shuttle", mediaType = "image") {
  // Navigate to the page
  await page.goto("/");

  // Trigger a search
  await page.fill('input[name="keywords"]', keywords);
  await page.selectOption('select[name="mediaType"]', mediaType);
  await page.click('button[type="submit"]');

  // Wait for the list to render
  await page.waitForSelector('h2');
}

test.describe("DescriptionModal Component", () => {
  test.only("displays preview text correctly and truncates long descriptions", async ({ page }) => {
    await setupSearch(page);

  // Get the preview container and check for truncated content
  const previewContainer = page.getByRole('region', { name: 'Description Modal' });
  await expect(previewContainer).toBeVisible();

  // Check for truncated text using textContent
  const previewText = await previewContainer.textContent();
  expect(previewText).toContain('...');

  // Check for Read More button using role
  const readMoreButton = page.getByRole('button', { name: 'Read more' }).first();
  await expect(readMoreButton).toBeVisible();

  });

  test("opens modal and displays full description when 'Read more' is clicked", async ({ page }) => {
    await setupSearch(page);


    // Find and click the first "Read more" button
    const readMoreButton = page.getByRole('button', { name: 'Read more' }).first();
    await expect(readMoreButton).toBeVisible();
    await readMoreButton.click();

    // Use a more specific selector for the modal
    const modal = page.getByRole('dialog', { name: 'description-modal' });
    await expect(modal).toBeVisible();
    
    // Check modal content
    const modalContent = modal.getByRole('heading', { level: 2 });
    await expect(modalContent).toBeVisible();

    // Close modal and verify it's gone
    const closeButton = modal.getByRole('button', { name: 'Close' });
    await closeButton.click();
    await expect(modal).not.toBeVisible();
  });


  test("displays formatted transcript for audio media correctly", async ({ page }) => {
    // Specific setup for audio
    await page.goto("/");

    await page.fill('input[name="keywords"]', "apollo audio");
    await page.selectOption('select[name="mediaType"]', "audio");
    await page.click('button[type="submit"]');

    await page.waitForSelector('h2');

    // Open the modal
    const readMoreButton = page.getByRole("button", { name: "Read more" }).first();
    await readMoreButton.click();

    // Validate speaker segmentation
    const speakerOne = page.getByText("Speaker 1:");
    const speakerTwo = page.getByText("Speaker 2:");
    await expect(speakerOne).toBeVisible();
    await expect(speakerTwo).toBeVisible();

    const speakerOneContent = page.getByText("Hello, this is a test transcript.");
    const speakerTwoContent = page.getByText("This is another line from another speaker.");
    await expect(speakerOneContent).toBeVisible();
    await expect(speakerTwoContent).toBeVisible();
  });

});
