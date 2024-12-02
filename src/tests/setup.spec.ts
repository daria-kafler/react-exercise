import { expect, test } from "@playwright/test";
import { mockNasaApiResponse } from "./mocks/mockNasaApiResponse";

test.describe("API Mocking Setup Verification", () => {
  for (const mediaType of ['image', 'video', 'audio'] as const) {
    test(`verifies NASA API mocking works for ${mediaType} type`, async ({ page }) => {
      let interceptedUrl: string | null = null;

      // Set up the interceptor
      await page.route('**/*', async (route) => {
        const url = route.request().url();
        if (url.includes('images-api.nasa.gov')) {
          interceptedUrl = url;
          console.log(`Intercepted NASA API call for ${mediaType}:`, url);
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockNasaApiResponse)
          });
        } else {
          await route.continue();
        }
      });

      // Make a direct API call
      const testUrl = `https://images-api.nasa.gov/search?keywords=apollo&media_type=${mediaType}&year_start=2024`;
      
      const response = await page.evaluate(async (url) => {
        const res = await fetch(url);
        return res.json();
      }, testUrl);

      // Verify the interception worked
      expect(interceptedUrl, 'API call should have been intercepted').toBeTruthy();
      expect(interceptedUrl).toBe(testUrl);
      expect(response).toEqual(mockNasaApiResponse);
    });
  }
});