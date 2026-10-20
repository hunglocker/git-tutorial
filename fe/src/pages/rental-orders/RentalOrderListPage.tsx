import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRentalOrders } from '@/hooks/useRentalOrders';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { RentalStatusBadge, PaymentStatusBadge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/utils/format';
import type { RentalStatus } from '@/types';
import styles from './RentalOrderListPage.module.css';

const STATUS_FILTERS: { label: string; value: RentalStatus | 'All' }[] = [
  { label: 'Tất cả', value: 'All' },
  { label: 'Chờ xử lý', value: 'Pending' },
  { label: 'Đang thuê', value: 'Active' },
  { label: 'Quá hạn', value: 'Overdue' },
  { label: 'Đã trả', value: 'Returned' },
  { label: 'Đã hủy', value: 'Cancelled' },
];

export default function RentalOrderListPage() {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useRentalOrders();
  const [statusFilter, setStatusFilter] = useState<RentalStatus | 'All'>('All');
  const [search, setSearch] = useState('');

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  const filtered = (orders ?? []).filter((o) => {
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      o.orderCode.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.productName.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <PageHeader
        title="Đơn thuê"
        description="Quản lý tất cả đơn thuê hàng"
        actions={
          <Button onClick={() => navigate('/rental-orders/create')}>
            + Tạo đơn thuê
          </Button>
        }
      />

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              className={[
                styles.filterBtn,
                statusFilter === f.value ? styles.filterBtnActive : '',
              ].join(' ')}
              onClick={() => setStatusFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          className={styles.searchInput}
          type="search"
          placeholder="Tìm mã đơn, khách hàng, sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Tìm kiếm đơn thuê"
        />
      </div>

      <div className={styles.card}>
        {filtered.length === 0 ? (
          <p className={styles.empty}>Không có đơn thuê nào.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Ngày bắt đầu</th>
                <th>Ngày trả dự kiến</th>
                <th>Tổng tiền</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className={styles.tableRow}
                  onClick={() => navigate(`/rental-orders/${order.id}`)}
                >
                  <td className={styles.orderCode}>{order.orderCode}</td>
                  <td>
                    <div className={styles.customerName}>{order.customerName}</div>
                    <div className={styles.phone}>{order.customerPhone}</div>
                  </td>
                  <td>
                    <div>{order.productName}</div>
                    <div className={styles.productCode}>{order.productCode}</div>
                  </td>
                  <td>{formatDate(order.startDate)}</td>
                  <td>{formatDate(order.expectedReturnDate)}</td>
                  <td className={styles.amount}>{formatCurrency(order.totalAmount)}</td>
                  <td>
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </td>
                  <td>
                    <RentalStatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
