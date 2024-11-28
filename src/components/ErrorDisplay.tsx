import { Heading } from "@cruk/cruk-react-components";
import { ErrorWithMessage } from "../types"

// Functions to check error types, stringify if needed
function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as Record<string, unknown>).message === 'string'
    )
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
    if (isErrorWithMessage(maybeError)) return maybeError

    try {
        return new Error(JSON.stringify(maybeError))
    } catch {
        return new Error(String(maybeError))
    }
}

function getErrorMessage(error: unknown) {
    return toErrorWithMessage(error).message
}

// ErrorDisplay logic
interface ErrorDisplayProps {
    error: unknown;
    type?: 'error' | 'loading' | 'noResults';
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, type = 'error' }) => {
    const message = getErrorMessage(error);
    switch(type) {
        case 'loading':
            return <Heading>Loading results, please wait...</Heading>;
        case 'noResults':
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