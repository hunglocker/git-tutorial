import type { RentalStatus, PaymentStatus, ProductStatus } from '@/types';
import styles from './Badge.module.css';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <span className={[styles.badge, styles[variant]].join(' ')}>
      {label}
    </span>
  );
}

export function RentalStatusBadge({ status }: { status: RentalStatus }) {
  const variantMap: Record<RentalStatus, BadgeVariant> = {
    Pending: 'warning',
    Active: 'success',
    Returned: 'info',
    Cancelled: 'muted',
    Overdue: 'danger',
  };

  const labelMap: Record<RentalStatus, string> = {
    Pending: 'Chờ xử lý',
    Active: 'Đang thuê',
    Returned: 'Đã trả',
    Cancelled: 'Đã hủy',
    Overdue: 'Quá hạn',
  };

  return <Badge label={labelMap[status]} variant={variantMap[status]} />;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const variantMap: Record<PaymentStatus, BadgeVariant> = {
    Unpaid: 'danger',
    Paid: 'success',
    Refunded: 'info',
    PartiallyPaid: 'warning',
  };

  const labelMap: Record<PaymentStatus, string> = {
    Unpaid: 'Chưa thanh toán',
    Paid: 'Đã thanh toán',
    Refunded: 'Đã hoàn tiền',
    PartiallyPaid: 'Thanh toán một phần',
  };

  return <Badge label={labelMap[status]} variant={variantMap[status]} />;
}

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const variantMap: Record<ProductStatus, BadgeVariant> = {
    Available: 'success',
    Rented: 'warning',
    Maintenance: 'info',
    Retired: 'muted',
  };

  const labelMap: Record<ProductStatus, string> = {
    Available: 'Sẵn sàng',
    Rented: 'Đang cho thuê',
    Maintenance: 'Bảo trì',
    Retired: 'Ngừng sử dụng',
  };

  return <Badge label={labelMap[status]} variant={variantMap[status]} />;
}
