import { useForm } from 'react-hook-form';
import { FormField, Input } from '@/components/ui/FormField';
import Button from '@/components/ui/Button';
import type { Category, CreateCategoryRequest } from '@/types';
import styles from './CategoryForm.module.css';

interface CategoryFormValues {
  name: string;
  description: string;
}

interface CategoryFormProps {
  defaultValues?: Category;
  onSubmit: (data: CreateCategoryRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function CategoryForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
    },
  });

  const handleFormSubmit = (values: CategoryFormValues) => {
    onSubmit({
      name: values.name.trim(),
      description: values.description.trim() || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className={styles.fields}>
        <FormField
          label="Tên danh mục"
          error={errors.name?.message}
          required
          htmlFor="category-name"
        >
          <Input
            id="category-name"
            hasError={!!errors.name}
            placeholder="Nhập tên danh mục"
            {...register('name', {
              required: 'Tên danh mục là bắt buộc.',
              maxLength: {
                value: 200,
                message: 'Tên không được vượt quá 200 ký tự.',
              },
            })}
          />
        </FormField>

        <FormField
          label="Mô tả"
          error={errors.description?.message}
          htmlFor="category-description"
        >
          <Input
            id="category-description"
            placeholder="Nhập mô tả (tùy chọn)"
            {...register('description', {
              maxLength: {
                value: 1000,
                message: 'Mô tả không được vượt quá 1000 ký tự.',
              },
            })}
          />
        </FormField>
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {defaultValues ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </div>
    </form>
  );
}
