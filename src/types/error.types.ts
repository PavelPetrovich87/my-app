export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public error: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class AuthError extends ApiError {
  constructor(message: string, statusCode: number = 401) {
    super(statusCode, message, 'Authentication Error');
    this.name = 'AuthError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string | string[]) {
    super(400, Array.isArray(message) ? message.join(', ') : message, 'Validation Error');
    this.name = 'ValidationError';
  }
} 