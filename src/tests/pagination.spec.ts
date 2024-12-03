import { expect, test } from "@playwright/test";

test.describe("List Pagination", () => {
  test("handles pagination correctly", async ({ page }) => {
    // Perform search that will return multiple pages
    await page.goto("/");
    await page.fill('input[name="keywords"]', "apollo");  // "apollo" typically returns many results
    await page.selectOption('select[name="mediaType"]', "image");
    await page.click('button[type="submit"]');

    // Wait for initial results
    await expect(page.getByText("Loading...")).not.toBeVisible({ timeout: 10000 });

    // Check first page info
    const infoText = page.getByText(/Showing.*out of.*for:/);
    await expect(infoText).toBeVisible();
    const firstPageInfo = await infoText.textContent();
    expect(firstPageInfo).toContain("1 - 10"); // First page should show results 1-10

    // Store first page titles
    const firstPageTitles = await page.locator("h2").allTextContents();
    expect(firstPageTitles.length).toBeLessThanOrEqual(10);

    // Ensure pagination control is visible
    const pagination = page.getByRole('link', { name: 'Next' })
    await expect(pagination).toBeVisible();

    // Navigate to second page
    await pagination.click();

    // Wait for page change
    await expect(page.getByText("Loading...")).not.toBeVisible();

    // Check second page info
    const secondPageInfo = await infoText.textContent();
    expect(secondPageInfo).toContain("11 -"); // Second page should start at result 11

    // Get second page titles and verify they're different
    const secondPageTitles = await page.locator("h2").allTextContents();
    expect(secondPageTitles.length).toBeLessThanOrEqual(10);
    expect(secondPageTitles).not.toEqual(firstPageTitles);

    // Verify we can go back to first page
    const prevPage = await page.getByRole('link', { name: 'Prev' })
    await expect(prevPage).toBeVisible();
    await prevPage.click();

    // Wait for page change
    await expect(page.getByText("Loading...")).not.toBeVisible();

    // Verify we're back to first page results
    const backToFirstInfo = await infoText.textContent();
    expect(backToFirstInfo).toContain("1 - 10");

    // Verify titles match original first page
    const returnedTitles = await page.locator("h2").allTextContents();
    expect(returnedTitles).toEqual(firstPageTitles);
  });

  test("remembers page 1 when new search performed", async ({ page }) => {
    // Do initial search and go to page 2
    await page.goto("/");
    await page.fill('input[name="keywords"]', "apollo");
    await page.selectOption('select[name="mediaType"]', "image");
    await page.click('button[type="submit"]');
    
    await expect(page.getByText("Loading...")).not.toBeVisible();
    const pagination = await page.getByRole('link', { name: 'Next' })
    // Go to page 2
    await pagination.click();
    await expect(page.getByText("Loading...")).not.toBeVisible();
    
    // Verify we're on page 2
    let pageInfo = await page.getByText(/Showing.*out of.*for:/).textContent();
    expect(pageInfo).toContain("11 -");

    // Perform new search
    const changeSearch = page.getByRole('button', { name: 'Change search' })
    await changeSearch.click();
    await page.fill('input[name="keywords"]', "moon");
    await page.click('button[type="submit"]');
    await expect(page.getByText("Loading...")).not.toBeVisible();

    // Verify we're back to page 1, with the new search results
    pageInfo = await page.getByText(/Showing.*out of.*for:/).textContent();
    expect(pageInfo).toContain("1 - ");
  });
});