import { type NasaResponse, type ItemsType } from "../types";

/**
 * Type guard to validate the structure of NASA API responses.
 * Checks for required properties and data types in the response object.
 *
 * Validation includes:
 * - Presence of root data object
 * - Existence of collection property
 * - Items array structure
 * - Individual item data validation (title, data array)
 *
 * @param {any} unknown - Response data from NASA API to validate
 * @returns {boolean} true if data matches NasaResponse type structure, false otherwise
 */
export const validateNasaResponse = (data: unknown): data is NasaResponse => {
  const validationErrors: string[] = [];

  // Basic structure check
  if (!data || typeof data !== "object") {
    validationErrors.push("Data is null or undefined");
    return false;
  }
  // Type assertion after basic check
  const response = data as { collection?: { items?: unknown[] } };

  if (!response.collection) {
    validationErrors.push("Missing 'collection' property");
  }

  if (!response.collection?.items) {
    validationErrors.push("Missing 'items' property");
    return false;
  }
  if (!Array.isArray(response.collection.items)) {
    validationErrors.push("'items' is not an array");
    return false;
  }

  if (response.collection.items.length > 0) {
    response.collection.items.forEach((item: unknown, index: number) => {
      const typedItem = item as ItemsType;

      if (!Array.isArray(typedItem?.data) || !typedItem.data.length) {
        validationErrors.push(`Item ${index}: Missing or empty 'data' array`);
      } else if (typeof typedItem.data[0]?.title !== "string") {
        validationErrors.push(`Item ${index}: Invalid or missing title`);
      }
    });
  }

  if (validationErrors.length) {
    // Note: Error may log twice in development potentially due to React StrictMode
    console.error("Validation errors:", {
      errors: validationErrors,
      receivedData: JSON.stringify(data, null, 2),
    });
  }

  return validationErrors.length === 0;
};
