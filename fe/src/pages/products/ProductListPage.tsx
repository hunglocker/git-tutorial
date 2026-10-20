import { useState } from 'react';
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/hooks/useProducts';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { ProductStatusBadge } from '@/components/ui/Badge';
import ProductForm from '@/components/products/ProductForm';
import type { Product, CreateProductRequest } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';
import styles from './ProductListPage.module.css';

export default function ProductListPage() {
  const { data: products, isLoading, error } = useProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  const handleCreate = (data: CreateProductRequest) => {
    createMutation.mutate(data, {
      onSuccess: () => setShowCreateModal(false),
    });
  };

  const handleUpdate = (data: CreateProductRequest) => {
    if (!editingProduct) return;
    updateMutation.mutate(
      { id: editingProduct.id, request: data },
      { onSuccess: () => setEditingProduct(null) }
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
        title="Sản phẩm"
        description="Quản lý sản phẩm trong kho cho thuê"
        actions={
          <Button onClick={() => setShowCreateModal(true)}>+ Thêm sản phẩm</Button>
        }
      />

      {createMutation.error && <ErrorMessage error={createMutation.error} />}
      {updateMutation.error && <ErrorMessage error={updateMutation.error} />}
      {deleteMutation.error && <ErrorMessage error={deleteMutation.error} />}

      <div className={styles.card}>
        {!products || products.length === 0 ? (
          <p className={styles.empty}>Chưa có sản phẩm nào.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã SP</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá thuê / ngày</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th style={{ width: 120 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className={styles.code}>{product.code}</td>
                  <td className={styles.name}>{product.name}</td>
                  <td>{product.categoryName}</td>
                  <td>{formatCurrency(product.dailyRentalPrice)}</td>
                  <td>
                    <ProductStatusBadge status={product.status} />
                  </td>
                  <td>{formatDate(product.createdAt)}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingProduct(product)}
                      >
                        Sửa
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setDeletingId(product.id)}
                        disabled={product.status === 'Rented'}
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
        title="Thêm sản phẩm mới"
        onClose={() => setShowCreateModal(false)}
        size="lg"
      >
        <ProductForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          isSubmitting={createMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={!!editingProduct}
        title="Cập nhật sản phẩm"
        onClose={() => setEditingProduct(null)}
        size="lg"
      >
        {editingProduct && (
          <ProductForm
            defaultValues={editingProduct}
            onSubmit={handleUpdate}
            onCancel={() => setEditingProduct(null)}
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
          Bạn có chắc muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button variant="secondary" onClick={() => setDeletingId(null)}>
            Hủy
          </Button>
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
