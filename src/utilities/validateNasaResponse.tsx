import { NasaResponse } from "../types";

export const validateNasaResponse = (data: any): data is NasaResponse => {
  const validationErrors: string[] = [];

  if (!data) validationErrors.push("Data is null or undefined");
  if (!data?.collection) validationErrors.push("Missing 'collection' property");
  if (!Array.isArray(data?.collection?.items)) validationErrors.push("'items' is not an array");
  
  if (data?.collection?.items?.length) {
    data.collection.items.forEach((item, index) => {
      if (!item?.data?.length) {
        validationErrors.push(`Item ${index}: Missing or empty 'data' array`);
      } else if (typeof item.data[0].title !== "string") {
        validationErrors.push(`Item ${index}: Invalid or missing title`);
      }
    });
  }

  if (validationErrors.length) {
    // Note: Error may log twice in development potentially due to React StrictMode
    console.error("Validation errors:", {
      errors: validationErrors,
      receivedData: JSON.stringify(data, null, 2)
    });
  }

  const isValid = validationErrors.length === 0; // Return true if no errors, false if there are errors
  return isValid // I know this is clunky, the unintuitive line above broke my brain a little
};