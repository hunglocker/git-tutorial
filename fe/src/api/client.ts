import axios, { AxiosError } from 'axios';
import type { ProblemDetails, ApiError } from '@/types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ProblemDetails>) => {
    const apiError: ApiError = {
      status: error.response?.status ?? 0,
      title: error.response?.data?.title ?? 'Unexpected Error',
      detail:
        error.response?.data?.detail ??
        error.message ??
        'An unexpected error occurred.',
    };
    return Promise.reject(apiError);
  }
);
