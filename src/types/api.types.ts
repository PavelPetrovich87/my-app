export interface ApiRequestState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export interface ApiRequestOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}

export type ApiRequestFunction<T> = (...args: any[]) => Promise<T>; 