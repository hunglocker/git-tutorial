export interface ProblemDetails {
  status: number;
  title: string;
  detail: string;
  instance: string;
  traceId?: string;
}

export interface ApiError {
  status: number;
  title: string;
  detail: string;
}
