import { type NasaResponse } from "../types";

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
 * @param {any} data - Response data from NASA API to validate
 * @returns {boolean} true if data matches NasaResponse type structure, false otherwise
 */
export const validateNasaResponse = (data: any): data is NasaResponse => {
  const validationErrors: string[] = [];

  if (!data) validationErrors.push("Data is null or undefined");
  if (!data?.collection) validationErrors.push("Missing 'collection' property");
  if (!Array.isArray(data?.collection?.items))
    validationErrors.push("'items' is not an array");
  if (data?.collection?.items?.length) {
    data.collection.items.forEach(
      (item: { data: string | any[] }, index: any) => {
        if (!item?.data?.length) {
          validationErrors.push(`Item ${index}: Missing or empty 'data' array`);
        } else if (typeof item.data[0].title !== "string") {
          validationErrors.push(`Item ${index}: Invalid or missing title`);
        }
      },
    );
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
