import { useRentalOrders, useOverdueRentalOrders } from '@/hooks/useRentalOrders';
import { useProducts } from '@/hooks/useProducts';
import { useCustomers } from '@/hooks/useCustomers';
import PageHeader from '@/components/ui/PageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { RentalStatusBadge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/utils/format';
import { useNavigate } from 'react-router-dom';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: orders, isLoading: loadingOrders, error: ordersError } = useRentalOrders();
  const { data: overdueOrders } = useOverdueRentalOrders();
  const { data: products } = useProducts();
  const { data: customers } = useCustomers();

  if (loadingOrders) return <LoadingSpinner />;
  if (ordersError) return <ErrorMessage error={ordersError} />;

  const activeOrders = orders?.filter((o) => o.status === 'Active') ?? [];
  const pendingOrders = orders?.filter((o) => o.status === 'Pending') ?? [];
  const availableProducts = products?.filter((p) => p.status === 'Available') ?? [];
  const recentOrders = [...(orders ?? [])].slice(0, 5);

  const stats = [
    {
      label: 'Đơn đang thuê',
      value: activeOrders.length,
      icon: '📋',
      color: '#2563eb',
    },
    {
      label: 'Chờ xử lý',
      value: pendingOrders.length,
      icon: '⏳',
      color: '#d97706',
    },
    {
      label: 'Quá hạn',
      value: overdueOrders?.length ?? 0,
      icon: '⚠️',
      color: '#dc2626',
    },
    {
      label: 'Sản phẩm sẵn sàng',
      value: availableProducts.length,
      icon: '📦',
      color: '#16a34a',
    },
    {
      label: 'Khách hàng',
      value: customers?.length ?? 0,
      icon: '👤',
      color: '#7c3aed',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Tổng quan"
        description="Thống kê hoạt động hệ thống thuê hàng"
      />

      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <div className={styles.statValue} style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Đơn thuê gần đây</h2>
          <button
            className={styles.viewAll}
            onClick={() => navigate('/rental-orders')}
          >
            Xem tất cả →
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <p className={styles.empty}>Chưa có đơn thuê nào.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Sản phẩm</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày trả dự kiến</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={styles.tableRow}
                    onClick={() => navigate(`/rental-orders/${order.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className={styles.orderCode}>{order.orderCode}</td>
                    <td>{order.customerName}</td>
                    <td>{order.productName}</td>
                    <td>{formatDate(order.startDate)}</td>
                    <td>{formatDate(order.expectedReturnDate)}</td>
                    <td>{formatCurrency(order.totalAmount)}</td>
                    <td>
                      <RentalStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
