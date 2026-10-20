import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  label?: string;
}

export default function LoadingSpinner({
  label = 'Đang tải...',
}: LoadingSpinnerProps) {
  return (
    <div className={styles.container} role="status" aria-label={label}>
      <div className={styles.spinner} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
