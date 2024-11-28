// tests/mock/mockApi.ts
import { Page } from "@playwright/test";
import { mockNasaApiResponse } from "./mockNasaApiResponse";

// Scenarios for different API mock responses
const mockApiScenarios = {
  default: mockNasaApiResponse, // Default valid response
  invalidImageUrl: {
    ...mockNasaApiResponse,
    collection: {
      ...mockNasaApiResponse.collection,
      items: mockNasaApiResponse.collection.items.map((item: any) => ({
        ...item,
        links: [{ href: "invalid-url" }] // Invalid URL for images
      }))
    }
  },
  missingImageUrl: {
    ...mockNasaApiResponse,
    collection: {
      ...mockNasaApiResponse.collection,
      items: mockNasaApiResponse.collection.items.map((item: any) => ({
        ...item,
        links: [{ href: "" }] // Missing URL for images
      }))
    }
  },
  invalidParams: {
    // Simulate an API response with invalid params (e.g., empty collection or error)
    collection: {
      items: []
    }
  }
};

// Mock the API based on the scenario
export const mockApi = async (page: Page, scenario: keyof typeof mockApiScenarios) => {
  const responseBody = mockApiScenarios[scenario] || mockApiScenarios.default;

  await page.route("**/nasa-api/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(responseBody),
    })
  );
};
