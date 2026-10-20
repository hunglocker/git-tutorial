import type { ApiError } from '@/types';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  error: ApiError | Error | unknown;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  const message =
    error && typeof error === 'object' && 'detail' in error
      ? (error as ApiError).detail
      : error instanceof Error
        ? error.message
        : 'Đã có lỗi xảy ra. Vui lòng thử lại.';

  return (
    <div className={styles.container} role="alert">
      <span className={styles.icon} aria-hidden="true">⚠️</span>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
