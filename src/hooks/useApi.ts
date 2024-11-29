import { useState, useCallback } from 'react';
import { ApiRequestState, ApiRequestOptions, ApiRequestFunction } from '../types/api.types';
import { AuthError } from '../types/error.types';

export function useApi<T>(
  apiFunction: ApiRequestFunction<T>,
  options: ApiRequestOptions = {}
) {
  const [state, setState] = useState<ApiRequestState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setState((prev) => ({
          ...prev,
          isLoading: true,
          error: null,
        }));

        const data = await apiFunction(...args);

        setState((prev) => ({
          ...prev,
          data,
          isLoading: false,
        }));

        options.onSuccess?.(data);
        return data;
      } catch (error) {
        const errorObject = error instanceof Error ? error : new Error('An unknown error occurred');
        
        setState((prev) => ({
          ...prev,
          error: errorObject,
          isLoading: false,
        }));

        options.onError?.(errorObject);
        throw error;
      } finally {
        options.onSettled?.();
      }
    },
    [apiFunction, options]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
} 