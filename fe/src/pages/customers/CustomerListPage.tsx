import { useState } from 'react';
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from '@/hooks/useCustomers';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import CustomerForm from '@/components/customers/CustomerForm';
import type { Customer, CreateCustomerRequest } from '@/types';
import { formatDate } from '@/utils/format';
import styles from './CustomerListPage.module.css';

export default function CustomerListPage() {
  const { data: customers, isLoading, error } = useCustomers();
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  const filtered = customers?.filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      c.fullName.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  }) ?? [];

  const handleCreate = (data: CreateCustomerRequest) => {
    createMutation.mutate(data, {
      onSuccess: () => setShowCreateModal(false),
    });
  };

  const handleUpdate = (data: CreateCustomerRequest) => {
    if (!editingCustomer) return;
    updateMutation.mutate(
      { id: editingCustomer.id, request: data },
      { onSuccess: () => setEditingCustomer(null) }
    );
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => setDeletingId(null),
    });
  };

  return (
    <div>
      <PageHeader
        title="Khách hàng"
        description="Quản lý danh sách khách hàng thuê hàng"
        actions={
          <Button onClick={() => setShowCreateModal(true)}>+ Thêm khách hàng</Button>
        }
      />

      {createMutation.error && <ErrorMessage error={createMutation.error} />}
      {updateMutation.error && <ErrorMessage error={updateMutation.error} />}
      {deleteMutation.error && <ErrorMessage error={deleteMutation.error} />}

      <div className={styles.searchBar}>
        <input
          className={styles.searchInput}
          type="search"
          placeholder="Tìm theo tên, điện thoại, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Tìm kiếm khách hàng"
        />
      </div>

      <div className={styles.card}>
        {filtered.length === 0 ? (
          <p className={styles.empty}>
            {search ? 'Không tìm thấy khách hàng nào.' : 'Chưa có khách hàng nào.'}
          </p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Họ và tên</th>
                <th>Điện thoại</th>
                <th>Email</th>
                <th>CMND / CCCD</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th style={{ width: 120 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id}>
                  <td className={styles.name}>{customer.fullName}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.email ?? '—'}</td>
                  <td>{customer.identityNumber ?? '—'}</td>
                  <td>
                    <span className={customer.isActive ? styles.active : styles.inactive}>
                      {customer.isActive ? 'Hoạt động' : 'Ngừng'}
                    </span>
                  </td>
                  <td>{formatDate(customer.createdAt)}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingCustomer(customer)}
                      >
                        Sửa
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setDeletingId(customer.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        isOpen={showCreateModal}
        title="Thêm khách hàng mới"
        onClose={() => setShowCreateModal(false)}
        size="lg"
      >
        <CustomerForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          isSubmitting={createMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={!!editingCustomer}
        title="Cập nhật khách hàng"
        onClose={() => setEditingCustomer(null)}
        size="lg"
      >
        {editingCustomer && (
          <CustomerForm
            defaultValues={editingCustomer}
            onSubmit={handleUpdate}
            onCancel={() => setEditingCustomer(null)}
            isSubmitting={updateMutation.isPending}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!deletingId}
        title="Xác nhận xóa"
        onClose={() => setDeletingId(null)}
        size="sm"
      >
        <p style={{ marginBottom: 24 }}>
          Bạn có chắc muốn xóa khách hàng này? Hành động này không thể hoàn tác.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button variant="secondary" onClick={() => setDeletingId(null)}>Hủy</Button>
          <Button
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={() => deletingId && handleDelete(deletingId)}
          >
            Xóa
          </Button>
        </div>
      </Modal>
    </div>
  );
}
