import { AxiosError } from 'axios';
import { ApiError, ApiErrorResponse, AuthError, ValidationError } from '../types/error.types';

export const handleApiError = (error: unknown): never => {
  if (error instanceof ApiError) {
    throw error;
  }

  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse;
    
    // Handle specific error cases
    switch (error.response?.status) {
      case 401:
        throw new AuthError(Array.isArray(data?.message) ? data.message.join(', ') : data?.message || 'Authentication failed');
      case 400:
        throw new ValidationError(Array.isArray(data?.message) ? data.message.join(', ') : data?.message || 'Validation failed');
      case 409:
        throw new ApiError(409, Array.isArray(data?.message) ? data.message.join(', ') : data?.message || 'Conflict error', 'Conflict Error');
      default:
        throw new ApiError(
          error.response?.status || 500,
          Array.isArray(data?.message) ? data.message.join(', ') : data?.message || 'An unexpected error occurred',
          data?.error || 'Unknown Error'
        );
    }
  }

  // Handle unknown errors
  throw new ApiError(500, 'An unexpected error occurred', 'Unknown Error');
}; 