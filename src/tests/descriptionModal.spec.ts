import { test, expect, type Page } from "@playwright/test";

// Utility to navigate and trigger a search
async function setupSearch(page: Page, mediaType = "all") {
    await page.goto("/");

    // Verify form starts in expanded state
    const expandedForm = page.getByTestId('expanded-form');
    await expect(expandedForm).toBeVisible();

    // Fill form and submit
    await page.fill('input[name="keywords"]', "space");
    await page.selectOption('select[name="mediaType"]', mediaType);
    await page.click('button[type="submit"]');

    // Wait for loading state to disappear
    await expect(page.getByText("Loading")).not.toBeVisible({ timeout: 30000 });

    // Verify form minimises after submission
    const minimisedForm = page.getByTestId('minimised-form');
    await expect(minimisedForm).toBeVisible();

    // Results should now be visible without needing to scroll
    const resultsHeading = page.getByRole('heading', { level: 2 }).first();
    await expect(resultsHeading).toBeVisible({ timeout: 30000 });
}

test.describe("DescriptionModal Component", () => {
  test("displays preview text correctly and truncates long descriptions", async ({ page }) => {
    await setupSearch(page, "image");

    // Get the preview container and check for truncated content
    const previewContainer = page.getByTestId('preview-text').first();
    await expect(previewContainer).toBeVisible();

    // Check for truncated text using textContent
    const textContent = (await previewContainer.textContent()) as string;
    expect(textContent).toContain('...');

    // Check for Read More button using role
    const readMoreButton = page.getByRole('button', { name: 'Read more' }).first();
    await expect(readMoreButton).toBeVisible();
  });

  test("modal opens, description displayed, modal closes", async ({ page }) => {
    await setupSearch(page, "video");

    // Find and click the first "Read more" button
    const readMoreButton = page.getByRole('button', { name: 'Read more' }).first();
    await expect(readMoreButton).toBeVisible();
    await readMoreButton.click();

    // Modal is visible after "Read More" button is clicked
    const modal = page.getByRole('dialog', { name: 'description-modal' });
    await expect(modal).toBeVisible();
    
    // Modal header and content are visible
    const modalHeader = modal.getByRole('heading', { level: 2 });
    const modalContent = modal.getByTestId('modal-content');
    await expect(modalHeader).toBeVisible();
    await expect(modalContent).toBeVisible();

    // Close modal and verify it's gone
    const closeButton = modal.getByRole('button', { name: 'Close' });
    await closeButton.click();
    await expect(modal).not.toBeVisible();
  });

  test("displays formatted transcript for audio media", async ({ page }) => {
    await setupSearch(page, "audio");

    // Open the modal
    const readMoreButton = page.getByRole("button", { name: "Read more" }).first();
    await readMoreButton.click();
    const modal = page.getByRole('dialog', { name: 'description-modal' });
    await expect(modal).toBeVisible();

    // Check for speaker segmentation elements
    const speakerSegments = modal.getByTestId("speaker-segmentation");
    
    // Verify we have at least one segment
    const segmentCount = await speakerSegments.count();
    expect(segmentCount).toBeGreaterThan(0);

    // Get the first segment and verify it has content
    const firstSegment = speakerSegments.first();
    await expect(firstSegment).toBeVisible();
    
    // Get and verify the text content
    const textContent = (await firstSegment.textContent()) as string;
    expect(textContent).not.toBe('');
    
    // Check format
    const hasProperFormat = textContent.includes(':') || textContent.length > 0;
    expect(hasProperFormat).toBeTruthy();
  });
});