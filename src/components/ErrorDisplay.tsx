import { Heading, Loader } from "@cruk/cruk-react-components";
import { ErrorWithMessage } from "../types";

/**
 * function to check if an error object has a message property
 * @param error - Unknown error object to check
 * @returns boolean indicating if error has message property
 */
function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

/**
 * Converts any error type to ErrorWithMessage format
 * @param maybeError - Any potential error object
 * @returns Formatted error with message
 */
function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}

/**
 * Extracts error message from unknown error type
 * @param error - Any error object
 * @returns Error message string
 */
function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message;
}

// ErrorDisplay logic
/**
 * Props for the ErrorDisplay component
 * @interface ErrorDisplayProps
 */
interface ErrorDisplayProps {
  /** Error object or message to display */
  error: unknown;
  type?: "error" | "loading" | "noResults";
}

/**
 * Component to handle various error and loading states.
 * Features:
 * - Loading spinner
 * - No results message
 * - Generic error display
 * - Error logging to console
 *
 * @param props - Component props
 * @param props.error - Error object or message
 * @param props.type - Type of error state to display
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  type = "error",
}) => {
  const message = getErrorMessage(error);
  switch (type) {
    case "loading":
      return <Loader />;
    case "noResults":
      return <Heading>Results not found. Try broadening your search.</Heading>;
    default:
      console.error("Error occurred:", message);
      return (
        <>
          <Heading>Oops, something went wrong</Heading>
        </>
      );
  }
};
