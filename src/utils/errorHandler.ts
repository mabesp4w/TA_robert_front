/** @format */

import toast from "react-hot-toast";

interface ValidationErrors {
  [key: string]: string[];
}

interface ApiErrorResponse {
  status?: string;
  message?: string;
  errors?: ValidationErrors;
  detail?: string;
}

/**
 * Formats validation errors from API response into a readable string
 * @param errors - Object containing field names as keys and error messages as arrays
 * @returns Formatted error string
 */
export const formatValidationErrors = (errors: ValidationErrors): string => {
  const errorMessages: string[] = [];
  
  for (const field in errors) {
    if (errors.hasOwnProperty(field)) {
      const messages = errors[field];
      if (Array.isArray(messages)) {
        messages.forEach(msg => {
          errorMessages.push(msg);
        });
      }
    }
  }
  
  return errorMessages.join('\n');
};

/**
 * Extracts error message from API error response
 * Prioritizes validation errors (errors field) over generic message
 * @param error - Axios error object
 * @param defaultMessage - Default message if no error found
 * @returns Error message string
 */
export const extractErrorMessage = (error: any, defaultMessage: string = "Terjadi kesalahan"): string => {
  const responseData: ApiErrorResponse = error.response?.data;
  
  if (!responseData) {
    return error.message || defaultMessage;
  }
  
  // Check if there are validation errors - prioritize these
  if (responseData.errors && Object.keys(responseData.errors).length > 0) {
    return formatValidationErrors(responseData.errors);
  }
  
  // Fall back to message or detail
  return responseData.message || responseData.detail || defaultMessage;
};

/**
 * Shows appropriate toast error message from API response
 * @param error - Axios error object
 * @param defaultMessage - Default message if no error found
 */
export const showErrorToast = (error: any, defaultMessage: string = "Terjadi kesalahan"): void => {
  const errorMessage = extractErrorMessage(error, defaultMessage);
  
  // Split by newline to show multiple toasts for each error if needed
  const errorLines = errorMessage.split('\n');
  
  if (errorLines.length === 1) {
    toast.error(errorMessage, { duration: 5000 });
  } else {
    // For multiple errors, show them all
    errorLines.forEach((line, index) => {
      setTimeout(() => {
        toast.error(line, { duration: 5000 });
      }, index * 300); // Stagger toasts slightly
    });
  }
};

export default {
  formatValidationErrors,
  extractErrorMessage,
  showErrorToast,
};
