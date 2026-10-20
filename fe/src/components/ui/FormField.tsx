import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';
import styles from './FormField.module.css';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  htmlFor?: string;
}

export function FormField({
  label,
  error,
  required,
  children,
  htmlFor,
}: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {' '}*
          </span>
        )}
      </label>
      {children}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function Input({ hasError, className = '', ...props }: InputProps) {
  return (
    <input
      className={[styles.input, hasError ? styles.inputError : '', className]
        .filter(Boolean)
        .join(' ')}
      aria-invalid={hasError}
      {...props}
    />
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export function Select({ hasError, className = '', children, ...props }: SelectProps) {
  return (
    <select
      className={[styles.input, hasError ? styles.inputError : '', className]
        .filter(Boolean)
        .join(' ')}
      aria-invalid={hasError}
      {...props}
    >
      {children}
    </select>
  );
}
