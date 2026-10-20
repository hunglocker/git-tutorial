import { useState } from 'react';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/useCategories';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import CategoryForm from '@/components/categories/CategoryForm';
import type { Category, CreateCategoryRequest } from '@/types';
import { formatDate } from '@/utils/format';
import styles from './CategoryListPage.module.css';

export default function CategoryListPage() {
  const { data: categories, isLoading, error } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  const handleCreate = (data: CreateCategoryRequest) => {
    createMutation.mutate(data, {
      onSuccess: () => setShowCreateModal(false),
    });
  };

  const handleUpdate = (data: CreateCategoryRequest) => {
    if (!editingCategory) return;
    updateMutation.mutate(
      { id: editingCategory.id, request: data },
      { onSuccess: () => setEditingCategory(null) }
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
        title="Danh mục sản phẩm"
        description="Quản lý các danh mục sản phẩm cho thuê"
        actions={
          <Button onClick={() => setShowCreateModal(true)}>+ Thêm danh mục</Button>
        }
      />

      {createMutation.error && <ErrorMessage error={createMutation.error} />}
      {updateMutation.error && <ErrorMessage error={updateMutation.error} />}
      {deleteMutation.error && <ErrorMessage error={deleteMutation.error} />}

      <div className={styles.card}>
        {!categories || categories.length === 0 ? (
          <p className={styles.empty}>Chưa có danh mục nào.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tên danh mục</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th style={{ width: 120 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className={styles.name}>{cat.name}</td>
                  <td className={styles.desc}>{cat.description ?? '—'}</td>
                  <td>
                    <span className={cat.isActive ? styles.active : styles.inactive}>
                      {cat.isActive ? 'Hoạt động' : 'Ngừng'}
                    </span>
                  </td>
                  <td>{formatDate(cat.createdAt)}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingCategory(cat)}
                      >
                        Sửa
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setDeletingId(cat.id)}
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

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        title="Thêm danh mục mới"
        onClose={() => setShowCreateModal(false)}
      >
        <CategoryForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          isSubmitting={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingCategory}
        title="Cập nhật danh mục"
        onClose={() => setEditingCategory(null)}
      >
        {editingCategory && (
          <CategoryForm
            defaultValues={editingCategory}
            onSubmit={handleUpdate}
            onCancel={() => setEditingCategory(null)}
            isSubmitting={updateMutation.isPending}
          />
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deletingId}
        title="Xác nhận xóa"
        onClose={() => setDeletingId(null)}
        size="sm"
      >
        <p style={{ marginBottom: 24 }}>
          Bạn có chắc muốn xóa danh mục này không? Hành động này không thể hoàn tác.
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
